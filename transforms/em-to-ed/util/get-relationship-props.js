function getRelationshipProps(path) {
  let args = path.value.value.arguments;
  let hash = args.length > 1 ? args[1].properties : [];
  let key = hash.find(p => p.key.name === 'key');
  let embedded = hash.find(p => p.key.name === 'embedded');
  let embeddedValue = embedded ? embedded.value.value : false;
  return {
    model: args[0].name,
    key: key ? key.value.value : '',
    property: path.value.key.name,
    embedded: embeddedValue,
  };
}

module.exports = getRelationshipProps;
