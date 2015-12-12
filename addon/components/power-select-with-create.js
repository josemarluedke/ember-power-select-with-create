import Ember from 'ember';
import layout from '../templates/components/power-select-with-create';
const { computed } = Ember;

export default Ember.Component.extend({
  tagName: '',
  layout: layout,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    Ember.assert('{{power-select-with-create}} requires an `oncreate` function', this.get('oncreate') && typeof this.get('oncreate') === 'function');
  },

  // CPs
  optionsArray: computed('options.[]', function() {
    return Ember.A(this.get('options')).toArray();
  }),

  // Actions
  actions: {
    searchAndSuggest(term) {
      let newOptions;
      if (term.length > 0) {
        newOptions = this.get('optionsArray').filter(e => e.name.indexOf(term) > -1);
        newOptions.unshift(this.buildSuggestionForTerm(term));
      } else {
        newOptions = this.get('optionsArray');
      }
      return newOptions;
    },

    selectOrCreate(option) {
      if (option && option.__isSuggestion__) {
        this.get('oncreate')(option.__value__);
      } else {
        this.get('onchange')(option);
      }
    }
  },

  // Methods
  buildSuggestionForTerm(term) {
    return {
      __isSuggestion__: true,
      __value__: term,
      text: this.buildSuggestionLabel(term),
    };
  },

  buildSuggestionLabel(term) {
    let buildSuggestion = this.get('buildSuggestion');
    if (buildSuggestion) {
      return buildSuggestion(term);
    }
    return `Add "${term}"...`;
  }
});
