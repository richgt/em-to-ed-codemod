const FORMATTING = require('./formatting');

const COMMENT_TEXT = {
  adapter:
    ' CODE MIGRATION HINT: This model had a custom `adapter` defined so it may contain functionality which does not come out of the box in Ember Data. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.',
  collectionKey:
    ' CODE MIGRATION HINT: This model had a `collectionKey` defined so its payload will not automatically map to Ember Data. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.',
  primaryKey:
    ' CODE MIGRATION HINT: This model had a custom `primaryKey` defined so you may need configure this in an Ember Data serializer. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.',
  url:
    " CODE MIGRATION HINT: This model had a custom `url` defined so its URL may not automatically map to Ember Data's. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.",
  urlSuffix:
    ' CODE MIGRATION HINT: This model had a custom `urlSuffix` defined so you may need to configure this in an Ember Data serializer. Visit the docs at https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#migrating-custom-ember-model-configuration-to-ember-data to see how to address this issue.',
};

const EMBER_MODEL_CONFIGURATION_KEYS = [
  'adapter',
  'camelizeKeys',
  'collectionKey',
  'primaryKey',
  'url',
  'urlSuffix',
  'rootKey',
];

function addComment(j, path, text) {
  let comment = j.commentLine(text, true, false);
  path.comments = path.comments || [];
  if (!path.comments.find(comment => comment.value.includes(text))) {
    path.comments.push(comment);
  }
}
function isUsingSimpleAdapter(prop) {
  return (
    prop.key.name === 'adapter' &&
    prop.value.callee.object.name === 'RestAdapter' &&
    prop.value.arguments.length === 0
  );
}

function removeRestAdapterImport(j, source) {
  return j(source)
    .find(j.ImportDeclaration, {
      source: {
        value: 'embercom/models/adapters/rest-adapter',
      },
    })
    .forEach(path => {
      path.prune();
    })
    .toSource(FORMATTING);
}

function annotateEmberModelConfiguration(j, source) {
  let shouldRemoveAdapter;
  let code = j(source)
    .find(j.CallExpression, {
      callee: {
        property: {
          name: 'reopenClass',
        },
      },
    })
    .forEach(path => {
      let obj = path.value.arguments.find(n => n.type === 'ObjectExpression');
      if (!obj) {
        return;
      }
      obj.properties
        .filter(prop => EMBER_MODEL_CONFIGURATION_KEYS.includes(prop.key.name))
        .forEach(prop => {
          shouldRemoveAdapter = shouldRemoveAdapter || isUsingSimpleAdapter(prop);
          // Remove empty configuration keys or `primaryKey: 'id'`
          if (
            (prop.key.name === 'primaryKey' && prop.value.value === 'id') ||
            prop.key.name === 'camelizeKeys' ||
            shouldRemoveAdapter ||
            (prop.value.type.includes('Literal') && !prop.value.value)
          ) {
            let propertyIndex = obj.properties.findIndex(p => p.value.value === prop.value.value);
            obj.properties.splice(propertyIndex, 1);
          } else {
            addComment(j, prop, COMMENT_TEXT[prop.key.name]);
          }
        });
    })
    .toSource(FORMATTING);
  if (shouldRemoveAdapter) {
    code = removeRestAdapterImport(j, code);
  }
  return code;
}

module.exports = annotateEmberModelConfiguration;
