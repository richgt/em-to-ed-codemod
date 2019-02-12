import IntercomModel from 'embercom/models/types/intercom-model';
import { hasMany } from 'ember-model';
import Permission from 'embercom/models/permission';
import User from 'embercom/models/user';
import Team from 'embercom/models/team';
import ExternalProfile from 'embercom/models/external-profile';

export default IntercomModel.extend({
  availablePermissions: hasMany(Permission, { key: 'available_roles', embedded: true }),
  users: hasMany(User, { key: 'user_ids', embedded: false }),
  team: hasMany(Team, { key: 'team_ids' }),
  externalProfile: hasMany(ExternalProfile),
});
