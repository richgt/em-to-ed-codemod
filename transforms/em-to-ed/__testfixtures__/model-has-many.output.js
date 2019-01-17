import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default DS.Model.extend({
  tags: DS.attr('ember-model-has-many', {
    modelClass: Tag,
    embedded: true,
  }),
  admin: DS.attr('ember-model-has-many', {
    modelClass: Admin,
    embedded: false,
  }),
  team: DS.attr('ember-model-has-many', {
    modelClass: Team,
    embedded: false,
  }),
});
