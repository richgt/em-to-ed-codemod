import DS from 'ember-data';
import Tag from 'embercom/models/tag';

export default DS.Model.extend({
  tags: DS.attr('ember-model-has-many', { modelClass: Tag, embedded: true }),
});
