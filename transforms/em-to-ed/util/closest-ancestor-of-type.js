function closestAncestorOfType(startPath, typeRegex) {
  let current = startPath.parentPath;
  while (current.parentPath && !typeRegex.test(current.value.type)) {
    current = current.parentPath;
  }
  return current || null;
}

module.exports = closestAncestorOfType;
