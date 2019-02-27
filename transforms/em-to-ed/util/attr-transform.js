const addComment = require('./add-comment');

const FORMATTING = require('./formatting');
const TRANSFORM_MAPPINGS = {
  String: 'string',
  Boolean: 'boolean',
  Number: 'number',
  Array: 'array',
  JsonType: '',
};
const SERIALIZE_DESERIALIZE_COMMENT =
  ' CODE MIGRATION HINT: Ember Data does not support having the serialize/deserialize hooks as part of `DS.attr`. https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#deserializeserialize.';

function attrTransform(j, source) {
  return j(source)
    .find(j.CallExpression, {
      callee: {
        name: 'attr',
      },
    })
    .forEach(path => {
      path.replace(
        j.callExpression(j.identifier('DS.attr'), migrateAttrParams(j, path.value.arguments)),
      );
    })
    .toSource(FORMATTING);
}

function migrateAttrParams(j, params) {
  let attrType;
  if (!params.length) {
    return params;
  }

  if (params[0].type === 'Identifier') {
    attrType = TRANSFORM_MAPPINGS[params.name];
    params = migrateIdentifier(j, params);
  }

  if (isAttrASimpleType(attrType)) {
    return params;
  }

  if (paramsContainObjectExpression(params)) {
    params = transformSerializeDeserialize(j, params);
    params = transformDefaultValueObjectToArrowFunction(j, params);
  }

  return params;
}

function migrateIdentifier(j, params) {
  let firstParam = params[0];
  let attrType = TRANSFORM_MAPPINGS[firstParam.name];

  // Remove the Ember Model object type and re-add type string if available e.g. attr(Boolean) becomes attr('boolean')
  params.shift();
  if (attrType) {
    params.unshift(j.literal(attrType));
  }

  return params;
}

function paramsContainObjectExpression(params) {
  return (
    (params.length > 1 && params[1].type === 'ObjectExpression') ||
    (params.length && params[0].type === 'ObjectExpression')
  );
}

function transformSerializeDeserialize(j, params) {
  let objectExpIndex = params.findIndex(p => p.type === 'ObjectExpression');
  let objectExp = params[objectExpIndex];
  objectExp.properties
    .filter(prop => /deserialize|serialize/g.test(prop.key.name))
    .forEach(prop => {
      addComment(j, prop, SERIALIZE_DESERIALIZE_COMMENT);
    });
  return params;
}

function transformDefaultValueObjectToArrowFunction(j, params) {
  let objectExpIndex = params.findIndex(p => p.type === 'ObjectExpression');
  let objectExp = params[objectExpIndex];
  let defaultValueIndex = objectExp.properties.findIndex(p => p.key.name === 'defaultValue');
  if (defaultValueIndex > -1) {
    let defaultValue = objectExp.properties[defaultValueIndex];
    if (defaultValue && defaultValue.value.type.includes('Expression')) {
      let defaultValueType = defaultValue.value.type;
      objectExp.properties[defaultValueIndex] = j.objectProperty(
        j.identifier('defaultValue'),
        j.arrowFunctionExpression([], j[camelCase(defaultValueType)]([])),
      );
    }
  }
  return params;
}

function isAttrASimpleType(type) {
  return /boolean|number|string/.test(type);
}

function camelCase(text) {
  return text.substring(0, 1).toLowerCase() + text.substring(1);
}

module.exports = attrTransform;
