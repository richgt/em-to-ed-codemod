import IntercomModel from 'embercom/models/types/intercom-model';
import { belongsTo } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import User from 'embercom/models/user';

export default IntercomModel.extend({
  tag: belongsTo(Tag, { key: 'tag_id', embedded: true }),
  admin: belongsTo(Admin, { key: 'admin_id', embedded: false }),
  user: belongsTo(User, { key: 'user_id' }),
});
