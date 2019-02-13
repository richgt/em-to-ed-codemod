import IntercomModel from 'embercom/models/types/intercom-model';

export default IntercomModel.extend({
  someValue: attr(),
}).reopenClass({
  adapter: ConversationPartRESTAdapter.create(),
  collectionKey: 'conversation_parts',
  primaryKey: 'id',
  primaryKey: 'app_id',
  rootKey: '',
  url: '/ember/conversation_parts',
  urlSuffix: '.json',
});
