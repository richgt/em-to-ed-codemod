function getAncestorsOfType(startPath, typeRegex) {
  let ancestors = [];
  let current = startPath.parentPath;
  while (current.parentPath) {
    if (typeRegex.test(current.value.type)) {
      ancestors.push(current);
    }
    current = current.parentPath;
  }
  return ancestors;
}

module.exports = getAncestorsOfType;
