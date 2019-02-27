import IntercomModel from 'embercom/models/types/intercom-model';
import { getEmberDataStore } from 'embercom/lib/container-lookup';

export default IntercomModel.extend({
  someFunction() {
    let store = getEmberDataStore();
    store.pushPayload({ 'logs-settings': [{ id: '12' }] });
  },
  solutions: computed(function() {
    let store = getEmberDataStore();

    store.pushPayload('solution', { solutions: solutionsFixture });

    return store.peekAll('solution');
  }).volatile(),
  products: attr({
    serialize(products) {
      return products.map(p => p.serialize());
    },
    deserialize(products = []) {
      let store = getEmberDataStore();

      store.pushPayload('product', { products });

      return store.peekAll('product');
    },
  }),
});
