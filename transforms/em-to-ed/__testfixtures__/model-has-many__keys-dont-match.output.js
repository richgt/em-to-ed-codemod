import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import Permission from 'embercom/models/permission';
import User from 'embercom/models/user';
import Team from 'embercom/models/team';
import ExternalProfile from 'embercom/models/external-profile';

export default DS.Model.extend({
  available_roles: DS.attr('ember-model-has-many', { modelClass: Permission, embedded: true }),
  availablePermissions: alias('available_roles'),

  // CODE MIGRATION HINT: This is an async Ember Model `hasMany` relationship and due to ambiguity it can't be automatically migrated. See the following docs for advice on how to migrate this relationship https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#updating-hasmany-relationships
  users: hasMany(User, { key: 'user_ids', embedded: false }),

  // CODE MIGRATION HINT: This is an async Ember Model `hasMany` relationship and due to ambiguity it can't be automatically migrated. See the following docs for advice on how to migrate this relationship https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#updating-hasmany-relationships
  team: hasMany(Team, { key: 'team_ids' }),

  // CODE MIGRATION HINT: This is an async Ember Model `hasMany` relationship and due to ambiguity it can't be automatically migrated. See the following docs for advice on how to migrate this relationship https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#updating-hasmany-relationships
  externalProfile: hasMany(ExternalProfile),
});
