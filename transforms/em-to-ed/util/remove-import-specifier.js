const FORMATTING = require('./formatting');

function removeImportSpecifier(j, code, importSpecifier, source) {
  return j(code)
    .find(j.ImportDeclaration, {
      source: {
        value: source,
      },
    })
    .forEach(path => {
      let computedSpecifier = path.value.specifiers.find(
        specifier => specifier.imported.name === importSpecifier,
      );
      if (computedSpecifier) {
        j(computedSpecifier).prune();
        if (!path.value.specifiers.length) {
          j(path).prune();
        }
      }
    })
    .toSource(FORMATTING);
}

module.exports = removeImportSpecifier;
