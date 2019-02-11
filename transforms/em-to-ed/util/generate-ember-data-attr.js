function generateEmberDataAttr(property, transform, modelClass, embedded) {
  return `${property}: DS.attr('${transform}', { modelClass: ${modelClass}, embedded: ${embedded} })`;
}

module.exports = generateEmberDataAttr;
