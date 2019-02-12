const getRelationshipProps = require('./get-relationship-props');
const generateEmberDataAttr = require('./generate-ember-data-attr');
const addImportSpecifier = require('./add-import-specifier');
const FORMATTING = require('./formatting');

function isEmberModelBelongsTo(path) {
  if (path.value.type !== 'CallExpression') {
    return false;
  }
  let callExp = path.value;
  return callExp.callee && callExp.callee.name === 'belongsTo';
}

function belongsToTransform(j, source) {
  let code;
  let needsAliasImport = false;
  let needsComputedImport = false;

  code = j(source)
    .find(j.ObjectProperty, isEmberModelBelongsTo)
    .forEach(path => {
      let { key, property, embedded, model } = getRelationshipProps(path);

      if (key === property) {
        j(path).replaceWith(
          generateEmberDataAttr(property, 'ember-model-belongs-to', model, embedded),
        );
      } else if (key !== property && embedded) {
        needsAliasImport = true;
        j(path).replaceWith(
          `${generateEmberDataAttr(key, 'ember-model-belongs-to', model, true)},
${property}: alias('${key}')`,
        );
      } else if (key !== property && !embedded) {
        needsComputedImport = true;
        j(path).replaceWith(
          `${key}: DS.attr(),
${property}: computed('${key}', function() {
  return ${model}.find(this.${key});
})`,
        );
      }
    })
    .toSource(FORMATTING);

  if (needsComputedImport) {
    code = addImportSpecifier(j, code, 'computed', '@ember/object');
  }

  if (needsAliasImport) {
    code = addImportSpecifier(j, code, 'alias', '@ember/object/computed');
  }
  return code;
}

module.exports = belongsToTransform;
