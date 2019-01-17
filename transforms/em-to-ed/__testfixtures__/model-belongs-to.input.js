import IntercomModel from 'embercom/models/types/intercom-model';
import { belongsTo } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default IntercomModel.extend({
  tag: belongsTo(Tag, { key: 'tag_id', embedded: true }),
  admin: belongsTo(Admin, { key: 'admin_id', embedded: false }),
  team: belongsTo(Team, { key: 'team_id' }),
});
