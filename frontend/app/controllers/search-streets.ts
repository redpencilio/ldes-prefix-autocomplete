import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import AutocompleteService from 'frontend/services/autocomplete-service';

export default class SearchStreetsController extends Controller {
  @service
  autocompleteService!: AutocompleteService;

  @tracked
  value = '';

  @tracked
  suggestions: any[] = [];

  @action
  async onInputChange() {
    console.log(this.autocompleteService.value);
    this.suggestions = await this.autocompleteService.getSuggestions(
      this.value
    );
  }
}
