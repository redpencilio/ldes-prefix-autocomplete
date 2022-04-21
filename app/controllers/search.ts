import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import AutocompleteService from 'frontend/services/autocomplete-service';

export default class SearchController extends Controller {
  @service
  autocompleteService!: AutocompleteService;

  @tracked
  query = '';

  @tracked
  datasource = '';

  extension = '';

  @tracked
  suggestions: any[] = [];

  @action
  async onInputChange() {
    console.log(this.autocompleteService.value);
    this.suggestions = await this.autocompleteService.getSuggestions(
      this.query
    );
  }

  @action
  async onSelectExtension(extension: string) {
    this.extension = extension;
  }

  @action
  async onSetDatasource(event: any) {
    event.preventDefault();
    this.autocompleteService.setDataSource(this.datasource, this.extension);
  }
}
