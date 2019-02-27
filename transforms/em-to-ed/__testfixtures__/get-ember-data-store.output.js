import DS from 'ember-data';
import { getEmberDataStore } from 'embercom/lib/container-lookup';

export default DS.Model.extend({
  someFunction() {
    this.store.pushPayload({ 'logs-settings': [{ id: '12' }] });
  },
  solutions: computed(function() {
    this.store.pushPayload('solution', { solutions: solutionsFixture });

    return this.store.peekAll('solution');
  }).volatile(),
  products: DS.attr({
    // CODE MIGRATION HINT: Ember Data does not support having the serialize/deserialize hooks as part of `DS.attr`. https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#deserializeserialize.
    serialize(products) {
      return products.map(p => p.serialize());
    },
    // CODE MIGRATION HINT: Ember Data does not support having the serialize/deserialize hooks as part of `DS.attr`. https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#deserializeserialize.
    deserialize(products = []) {
      this.store.pushPayload('product', { products });

      return this.store.peekAll('product');
    },
  }),
});
