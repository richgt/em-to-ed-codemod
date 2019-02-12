import IntercomModel from 'embercom/models/types/intercom-model';
import { attr } from 'ember-model';
import JsonType from 'embercom/models/types/json';

export default IntercomModel.extend({
  emptyTransform: attr(),
  someJson: attr(JsonType),
  someArray: attr(Array),
  someBoolean: attr(Boolean),
  someNumber: attr(Number),
  someString: attr(String),
});
