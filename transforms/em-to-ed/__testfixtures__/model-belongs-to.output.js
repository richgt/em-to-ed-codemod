import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default DS.Model.extend({
  tag: DS.attr('ember-model-belongs-to', {
    modelClass: Tag,
    embedded: true,
  }),
  admin: DS.attr('ember-model-belongs-to', {
    modelClass: Admin,
    embedded: false,
  }),
  team: DS.attr('ember-model-belongs-to', {
    modelClass: Team,
    embedded: false,
  }),
});
