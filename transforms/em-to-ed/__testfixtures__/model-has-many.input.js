import IntercomModel from 'embercom/models/types/intercom-model';
import { hasMany } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default IntercomModel.extend({
  tags: hasMany(Tag, { key: 'tags', embedded: true }),
  admin: hasMany(Admin, { key: 'admin_id', embedded: false }),
  team: hasMany(Team, { key: 'team_id' }),
});
