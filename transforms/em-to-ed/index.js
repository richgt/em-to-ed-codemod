const { getParser } = require('codemod-cli').jscodeshift;
const belongsToTransform = require('./util/belongs-to-transform');
const hasManyTransform = require('./util/has-many-transform');
const attrTransform = require('./util/attr-transform');
const closestAncestorOfType = require('./util/closest-ancestor-of-type');
const FORMATTING = require('./util/formatting');

function migrateIntercomModelImport(j, source) {
  return j(source)
    .find(j.ImportDeclaration, {
      source: {
        value: 'embercom/models/types/intercom-model',
      },
    })
    .forEach(path => {
      path.replace(
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier('DS'))],
          j.literal('ember-data'),
        ),
      );
    })
    .toSource(FORMATTING);
}

function removeEmberModelImport(j, source) {
  return j(source)
    .find(j.ImportDeclaration, {
      source: {
        value: 'ember-model',
      },
    })
    .forEach(path => {
      path.prune();
    })
    .toSource(FORMATTING);
}

function migrateIntercomModelExtend(j, source) {
  return j(source)
    .find(j.MemberExpression, {
      object: { name: 'IntercomModel' },
      property: { name: 'extend' },
    })
    .forEach(path => {
      path.replace(j.memberExpression(j.identifier('DS.Model'), j.identifier('extend')));
    })
    .toSource(FORMATTING);
}

function removeJsonTypeImport(j, source) {
  return j(source)
    .find(j.ImportDefaultSpecifier, {
      local: {
        name: 'JsonType',
      },
    })
    .forEach(path => {
      let declaration = closestAncestorOfType(path, /ImportDeclaration/);
      declaration.prune();
    })
    .toSource(FORMATTING);
}

module.exports = function transformer(file, api) {
  const j = getParser(api);

  let source = file.source;
  source = migrateIntercomModelImport(j, file.source);
  source = migrateIntercomModelExtend(j, source);
  source = removeEmberModelImport(j, source);
  source = attrTransform(j, source);
  source = hasManyTransform(j, source);
  source = belongsToTransform(j, source);
  source = removeJsonTypeImport(j, source);
  return source;
};
