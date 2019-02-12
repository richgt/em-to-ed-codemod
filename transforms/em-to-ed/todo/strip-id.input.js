import IntercomModel from 'embercom/models/types/intercom-model';
import JsonType from 'embercom/models/types/json';

export default IntercomModel.extend({
  id: attr(),
  someBoolean: attr(Boolean),
});
