const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const FORMATTING_OPTIONS = { quote: 'single', trailingComma: true };

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
    .toSource(FORMATTING_OPTIONS);
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
    .toSource(FORMATTING_OPTIONS);
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
    .toSource(FORMATTING_OPTIONS);
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
    .toSource(FORMATTING_OPTIONS);
}

function migrateEmberModelHasMany(j, source) {
  return j(source)
    .find(j.CallExpression, {
      callee: {
        name: 'hasMany',
      },
    })
    .forEach(path => {
      let isEmbedded;
      let args = path.value.arguments;

      if (args.length > 1) {
        isEmbedded = getOptionValue('embedded', args[1]);
      }

      path.replace(
        j.callExpression(j.identifier('DS.attr'), [
          j.literal('ember-model-array'),
          j.objectExpression([
            j.property('init', j.identifier('modelClass'), args[0]),
            j.property(
              'init',
              j.identifier('embedded'),
              j.identifier(isEmbedded ? 'true' : 'false'),
            ),
          ]),
        ]),
      );
    })
    .toSource(FORMATTING_OPTIONS);
}

function migrateEmberModelBelongsTo(j, source) {
  return j(source)
    .find(j.CallExpression, {
      callee: {
        name: 'belongsTo',
      },
    })
    .forEach(path => {
      let isEmbedded;
      let args = path.value.arguments;

      if (args.length > 1) {
        isEmbedded = getOptionValue('embedded', args[1]);
      }

      path.replace(
        j.callExpression(j.identifier('DS.attr'), [
          j.literal('ember-model-belongs-to'),
          j.objectExpression([
            j.property('init', j.identifier('modelClass'), args[0]),
            j.property(
              'init',
              j.identifier('embedded'),
              j.identifier(isEmbedded ? 'true' : 'false'),
            ),
          ]),
        ]),
      );
    })
    .toSource(FORMATTING_OPTIONS);
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
  source = migrateEmberModelBelongsTo(j, source);
  return source;
};
