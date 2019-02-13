import DS from 'ember-data';
import { getEmberDataStore } from 'embercom/lib/container-lookup';

export default DS.Model.extend({}).reopenClass({
  someFunction() {
    let store = getEmberDataStore();
    store.pushPayload({ 'logs-settings': [{ id: '12' }] });
  },
});
