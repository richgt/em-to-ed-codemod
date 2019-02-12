import IntercomModel from 'embercom/models/types/intercom-model';
import JsonType from 'embercom/models/types/json';

export default IntercomModel.extend({
  someBoolean: attr(Boolean, { defaultValue: true }),
  someString: attr(String, { defaultValue: 'user' }),
  avatar_emoji: attr(String, { defaultValue: DEFAULT_EMOJI }),
  someArray: attr(Array, { defaultValue: [] }),
  someJson: attr(JsonType, { defaultValue: {} }),
});
