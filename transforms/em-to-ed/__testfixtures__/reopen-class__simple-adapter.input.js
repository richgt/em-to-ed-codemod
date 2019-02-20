import IntercomModel from 'embercom/models/types/intercom-model';
import RestAdapter from 'embercom/models/adapters/rest-adapter';

export default IntercomModel.extend({}).reopenClass({
  adapter: RestAdapter.create(),
});
