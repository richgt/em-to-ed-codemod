import DS from 'ember-data';
import { getEmberDataStore } from 'embercom/lib/container-lookup';

export default DS.Model.extend({
  someFunction() {
    this.store.pushPayload({ 'logs-settings': [{ id: '12' }] });
  },
});
