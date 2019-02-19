import PredefinedSegmentIconMap from 'embercom/models/data/predefined-segment-icon-map';
import DS from 'ember-data';

let SegmentModel = DS.Model.extend({}).reopenClass(PredefinedSegmentIconMap);

export default SegmentModel;
