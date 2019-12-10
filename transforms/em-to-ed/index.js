const { getParser } = require('codemod-cli').jscodeshift;
const belongsToTransform = require('./util/belongs-to-transform');
const hasManyTransform = require('./util/has-many-transform');
const attrTransform = require('./util/attr-transform');
const annotateEmberModelConfiguration = require('./util/annotate-ember-model-configuration');
const closestAncestorOfType = require('./util/closest-ancestor-of-type');
const FORMATTING = require('./util/formatting');

function migrateBaseModelImport(j, source) {
  return j(source)
    .find(j.ImportDeclaration, {
      source: {
        value: 'dashboard/models/base_model',
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

function removeEmberModelESLintComment(j, source) {
  return j(source)
    .find(j.Comment, { value: 'eslint-disable-next-line intercom/no-ember-model' })
    .forEach(path => {
      j(path).remove();
    })
    .toSource(FORMATTING);
}

function migrateBaseModelExtend(j, source) {
  return j(source)
    .find(j.MemberExpression, {
      object: { name: 'BaseModel' },
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

function stripId(j, source) {
  return j(source)
    .find(j.ObjectProperty, {
      key: {
        name: 'id',
      },
      value: {
        type: 'CallExpression',
        callee: {
          name: 'attr',
        },
      },
    })
    .forEach(path => {
      path.prune();
    })
    .toSource(FORMATTING);
}

module.exports = function transformer(file, api) {
  const j = getParser(api);

  let source = file.source;
  source = migrateBaseModelImport(j, file.source);
  source = migrateBaseModelExtend(j, source);
  source = removeEmberModelImport(j, source);
  source = removeEmberModelESLintComment(j, source);
  source = stripId(j, source);
  source = attrTransform(j, source);
  source = hasManyTransform(j, source);
  source = belongsToTransform(j, source);
  source = removeJsonTypeImport(j, source);
  source = annotateEmberModelConfiguration(j, source);
  return source;
};
