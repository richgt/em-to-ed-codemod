import PredefinedSegmentIconMap from 'embercom/models/data/predefined-segment-icon-map';
import IntercomModel from 'embercom/models/types/intercom-model';

let SegmentModel = IntercomModel.extend({}).reopenClass(PredefinedSegmentIconMap);

export default SegmentModel;
