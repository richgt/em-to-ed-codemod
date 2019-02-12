import DS from 'ember-data';

export default DS.Model.extend({
  someBoolean: DS.attr('boolean', { defaultValue: true }),
  someString: DS.attr('string', { defaultValue: 'user' }),
  avatar_emoji: DS.attr('string', { defaultValue: DEFAULT_EMOJI }),
  someArray: DS.attr('array', { defaultValue: () => [] }),
  someJson: DS.attr({ defaultValue: () => ({}) }),
});
