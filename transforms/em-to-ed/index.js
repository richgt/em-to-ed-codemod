const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const belongsToTransform = require('./util/belongs-to-transform');
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
    .toSource(FORMATTING);
}

function migrateEmberModelHasMany(j, source) {
  return j(source)
    .find(j.CallExpression, {
      callee: {
        name: 'hasMany',
      },
    })
    .forEach(path => {
      path.replace(emberModelTransform(j, 'ember-model-has-many', path.value.arguments));
    })
    .toSource(FORMATTING);
}

function emberModelTransform(j, transform, args) {
  let isEmbedded;

  if (args.length > 1) {
    isEmbedded = getOptionValue('embedded', args[1]);
  }

  return j.callExpression(j.identifier('DS.attr'), [
    j.literal(transform),
    j.objectExpression([
      j.property('init', j.identifier('modelClass'), args[0]),
      j.property('init', j.identifier('embedded'), j.identifier(isEmbedded ? 'true' : 'false')),
    ]),
  ]);
}

function getOptionValue(name, options) {
  let option = options.properties.find(p => p.key.name === name);
  if (!option) {
    return;
  }
  return option.value.value;
}

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  let source = file.source;
  source = migrateIntercomModelImport(j, file.source);
  source = migrateIntercomModelExtend(j, source);
  source = removeEmberModelImport(j, source);
  source = migrateEmberModelAttr(j, source);
  source = migrateEmberModelHasMany(j, source);
  source = belongsToTransform(j, source);
  return source;
};
