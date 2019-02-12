import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import User from 'embercom/models/user';

export default DS.Model.extend({
  tag_id: DS.attr('ember-model-belongs-to', { modelClass: Tag, embedded: true }),
  tag: alias('tag_id'),

  admin_id: DS.attr(),
  admin: computed('admin_id', function() {
    return Admin.find(this.admin_id);
  }),

  user_id: DS.attr(),
  user: computed('user_id', function() {
    return User.find(this.user_id);
  }),
});
