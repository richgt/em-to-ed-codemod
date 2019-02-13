import DS from 'ember-data';

export default DS.Model.extend({
  someValue: DS.attr(),
}).reopenClass({
  // CODE MIGRATION HINT: This model had a custom `adapter` defined so it may contain functionality which does not come out of the box in Ember Data. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.
  adapter: ConversationPartRESTAdapter.create(),

  // CODE MIGRATION HINT: This model had a `collectionKey` defined so its payload will not automatically map to Ember Data. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.
  collectionKey: 'conversation_parts',

  // CODE MIGRATION HINT: This model had a custom `primaryKey` defined so you may need configure this in an Ember Data serializer. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.
  primaryKey: 'app_id',

  // CODE MIGRATION HINT: This model had a custom `url` defined so its URL may not automatically map to Ember Data's. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.
  url: '/ember/conversation_parts',

  // CODE MIGRATION HINT: This model had a custom `urlSuffix` defined so you may need to configure this in an Ember Data serializer. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.
  urlSuffix: '.json',
});
