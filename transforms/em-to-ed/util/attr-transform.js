const FORMATTING = require('./formatting');

function migrateAttrParams(j, params) {
  let newTypes = {
    String: 'string',
    Boolean: 'boolean',
    Number: 'number',
    Array: 'array',
    JsonType: '',
  };
  if (!params.length) {
    return params;
  }
  if (params[0].type !== 'Identifier') {
    return params;
  }
  let newType = newTypes[params[0].name];
  params.shift();

  if (newType) {
    params.unshift(j.literal(newType));
  }

  return params;
}

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

module.exports = attrTransform;
