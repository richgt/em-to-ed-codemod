import IntercomModel from 'embercom/models/types/intercom-model';
import { hasMany } from 'ember-model';
import Tag from 'embercom/models/tag';

export default IntercomModel.extend({
  tags: hasMany(Tag, { key: 'tags', embedded: true }),
});
