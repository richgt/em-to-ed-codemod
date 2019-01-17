const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

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
    .toSource({ quote: 'single' });
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
    .toSource({ quote: 'single' });
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
    .toSource({ quote: 'single' });
}

function migrateEmberModelAttr(j, source) {
  return j(source)
    .find(j.CallExpression, {
      callee: {
        name: 'attr',
      },
    })
    .forEach(path => {
      path.replace(j.callExpression(j.identifier('DS.attr'), path.value.arguments));
    })
    .toSource({ quote: 'single' });
}

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  let source = file.source;
  source = migrateIntercomModelImport(j, file.source);
  source = migrateIntercomModelExtend(j, source);
  source = removeEmberModelImport(j, source);
  source = migrateEmberModelAttr(j, source);
  return source;
};
