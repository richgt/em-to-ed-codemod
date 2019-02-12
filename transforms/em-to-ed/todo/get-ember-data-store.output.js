import DS from 'ember-data';

export default DS.Model.extend({
  someFunction() {
    this.store.pushPayload({ 'logs-settings': [{ id: '12' }] });
  },
});
