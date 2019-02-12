const getRelationshipProps = require('./get-relationship-props');
const generateEmberDataAttr = require('./generate-ember-data-attr');
const addImportSpecifier = require('./add-import-specifier');
const FORMATTING = require('./formatting');

function isEmberModelHasMany(path) {
  if (path.value.type !== 'CallExpression') {
    return false;
  }
  let callExp = path.value;
  return callExp.callee && callExp.callee.name === 'hasMany';
}

function hasManyTransform(j, source) {
  let code;
  let needsAliasImport = false;

  code = j(source)
    .find(j.ObjectProperty, isEmberModelHasMany)
    .forEach(path => {
      let { key, property, embedded, model } = getRelationshipProps(path);

      if (key === property) {
        j(path).replaceWith(
          generateEmberDataAttr(property, 'ember-model-has-many', model, embedded),
        );
      } else if (key !== property && embedded) {
        needsAliasImport = true;
        j(path).replaceWith(
          `${generateEmberDataAttr(key, 'ember-model-has-many', model, true)},
${property}: alias('${key}')`,
        );
      } else {
        let comment = j.commentLine(
          " CODE MIGRATION HINT: This is an async Ember Model `hasMany` relationship and due to ambiguity it can't be automatically migrated. See the following docs for advice on how to migrate this relationship https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#updating-hasmany-relationships",
          true,
          false,
        );
        path.node.comments = path.node.comments || [];
        let hasExistingAsyncComment = path.node.comments.find(comment =>
          comment.value.includes('async Ember Model `hasMany`'),
        );
        if (!hasExistingAsyncComment) {
          path.node.comments.push(comment);
        }
      }
    })
    .toSource(FORMATTING);

  if (needsAliasImport) {
    code = addImportSpecifier(j, code, 'alias', '@ember/object/computed');
  }

  return code;
}

module.exports = hasManyTransform;
