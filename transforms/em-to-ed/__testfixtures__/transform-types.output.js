import DS from 'ember-data';

export default DS.Model.extend({
  emptyTransform: DS.attr(),
  someJson: DS.attr(),
  someArray: DS.attr('array'),
  someBoolean: DS.attr('boolean'),
  someNumber: DS.attr('number'),
  someString: DS.attr('string'),
});
