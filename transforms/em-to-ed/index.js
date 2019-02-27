const { getParser } = require('codemod-cli').jscodeshift;
const belongsToTransform = require('./util/belongs-to-transform');
const hasManyTransform = require('./util/has-many-transform');
const attrTransform = require('./util/attr-transform');
const annotateEmberModelConfiguration = require('./util/annotate-ember-model-configuration');
const closestAncestorOfType = require('./util/closest-ancestor-of-type');
const getAncestorsOfType = require('./util/get-ancestors-of-type');
const removeImportSpecifier = require('./util/remove-import-specifier');
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

function removeEmberModelESLintComment(j, source) {
  return j(source)
    .find(j.Comment, { value: 'eslint-disable-next-line intercom/no-ember-model' })
    .forEach(path => {
      j(path).remove();
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

function migrateGetEmberDataStore(j, source) {
  let isUsingGetEmberDataStoreInReopenClass = false;
  let code = j(source)
    .find(j.VariableDeclarator, {
      id: {
        name: 'store',
      },
      init: {
        callee: {
          name: 'getEmberDataStore',
        },
      },
    })
    .forEach(path => {
      if (isWithinReopenClass(path)) {
        isUsingGetEmberDataStoreInReopenClass = true;
        return;
      }
      if (closestAncestorOfType(path, /VariableDeclaration/)) {
        path.prune();
      }
    })
    .toSource(FORMATTING);

  code = j(code)
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          name: 'store',
        },
      },
    })
    .forEach(path => {
      if (isWithinReopenClass(path)) {
        return;
      }
      j(path).replaceWith(
        j.callExpression(
          j.memberExpression(
            j.memberExpression(j.thisExpression(), j.identifier('store')),
            path.value.callee.property,
          ),
          path.value.arguments,
        ),
      );
    })
    .toSource(FORMATTING);

  if (isUsingGetEmberDataStoreInReopenClass) {
    code = removeImportSpecifier(j, code, 'getEmberDataStore', 'embercom/helpers/container-lookup');
  }

  return code;
}

function isWithinReopenClass(path) {
  let ancestorCallExpressions = getAncestorsOfType(path, /CallExpression/);
  let callExpression = ancestorCallExpressions.find(path => {
    if (!path.value || !path.value.callee || !path.value.callee.property) {
      return false;
    }
    return /extend|reopenClass/.test(path.value.callee.property.name);
  });
  return callExpression.value.callee.property.name === 'reopenClass';
}

module.exports = function transformer(file, api) {
  const j = getParser(api);

  let source = file.source;
  source = migrateIntercomModelImport(j, file.source);
  source = migrateIntercomModelExtend(j, source);
  source = removeEmberModelImport(j, source);
  source = removeEmberModelESLintComment(j, source);
  source = stripId(j, source);
  source = attrTransform(j, source);
  source = hasManyTransform(j, source);
  source = belongsToTransform(j, source);
  source = removeJsonTypeImport(j, source);
  source = migrateGetEmberDataStore(j, source);
  source = annotateEmberModelConfiguration(j, source);
  return source;
};
