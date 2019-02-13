import IntercomModel from 'embercom/models/types/intercom-model';
import { getEmberDataStore } from 'embercom/lib/container-lookup';

export default IntercomModel.extend({
  otherFunction() {
    let store = getEmberDataStore();
    store.pushPayload({ 'logs-settings': [{ id: '12' }] });
  },
}).reopenClass({
  someFunction() {
    let store = getEmberDataStore();
    store.pushPayload({ 'logs-settings': [{ id: '12' }] });
  },
});
