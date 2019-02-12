import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import User from 'embercom/models/user';

export default DS.Model.extend({
  tag: DS.attr('ember-model-belongs-to', { modelClass: Tag, embedded: true }),
  admin: DS.attr('ember-model-belongs-to', { modelClass: Admin, embedded: false }),
  user: DS.attr('ember-model-belongs-to', { modelClass: User, embedded: false }),
});
