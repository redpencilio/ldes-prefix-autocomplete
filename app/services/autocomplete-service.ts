import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { example, tree } from 'frontend/utils/namespaces';
import { graph, Store, Fetcher, NamedNode } from 'rdflib';
export default class AutocompleteService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  @tracked
  datasource = '';

  @tracked
  extension: string = '';

  async setDataSource(datasource: string, extension: string) {
    this.datasource = datasource;
    this.extension = extension;
    let node = await this.fetchNode(datasource);
    this.visitedNodes.clear();
    this.visitedNodes.set('', node);
  }

  visitedNodes: Map<string, Store> = new Map<string, Store>();

  async getSuggestions(value: string): Promise<any[]> {
    console.log(value);
    if (value === '') {
      return [];
    }
    let suggestions: string[] = [];

    // Determine longest prefix of value which is stored in the visitedNodes map
    let longestPrefix = '';
    for (let i = 1; i < value.length; i++) {
      let prefix = value.substring(i, i + 1);
      if (this.visitedNodes.has(prefix)) {
        longestPrefix = prefix;
      } else {
        break;
      }
    }
    let relevantNode = await this.retrieveRelevantNodeRec(longestPrefix, value);
    if (relevantNode) {
      suggestions = this.getMatchingMembers(relevantNode, value);
    }

    return suggestions;
  }

  async retrieveRelevantNodeRec(
    prefix: string,
    value: string
  ): Promise<Store | undefined> {
    let relationPredicate = tree('relation');
    let node = this.visitedNodes.get(prefix);
    let relationIds = node
      ?.match(null, relationPredicate)
      .map((quad) => quad.object);
    if (relationIds) {
      for (const relationId of relationIds) {
        if (relationId instanceof NamedNode) {
          let relationValue = node?.match(relationId, tree('value')).firstObject
            ?.object.value;

          console.log(relationValue);
          let relationTarget = node?.match(relationId, tree('node')).firstObject
            ?.object.value;

          if (
            relationValue &&
            relationTarget &&
            value.toLowerCase().startsWith(relationValue.toLowerCase())
          ) {
            let node = await this.fetchNode(relationTarget);
            this.visitedNodes.set(relationValue, node);
            return this.retrieveRelevantNodeRec(relationValue, value);
          }
        }
      }
    }

    return node;
  }

  getMatchingMembers(node: Store, value: string): any[] {
    let members: any[] = [];
    let memberPredicate = tree('member');
    let memberIds = node
      .match(null, memberPredicate)
      .map((quad) => quad.object);
    memberIds.forEach((memberId) => {
      if (memberId instanceof NamedNode) {
        let memberName = node?.match(memberId, example('name')).firstObject
          ?.object.value;

        if (memberName?.toLowerCase()?.startsWith(value.toLowerCase())) {
          members.push({ id: memberId, name: memberName });
        }
      }
    });
    return members;
  }

  async fetchNode(url: string | NamedNode): Promise<Store> {
    url += this.extension;

    console.log(url);
    let node = graph();
    let fetcher = new Fetcher(node, {
      credentials: 'omit',
    });
    await new Promise<void>((resolve, reject) => {
      fetcher.nowOrWhenFetched(
        url,
        {
          credentials: 'omit',
        },
        function (ok) {
          if (ok) {
            resolve();
          } else {
            reject();
          }
        }
      );
    });
    return node;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'autocomplete-service': AutocompleteService;
  }
}
