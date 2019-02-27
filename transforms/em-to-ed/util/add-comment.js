module.exports = function addComment(j, path, text) {
  let comment = j.commentLine(text, true, false);
  path.comments = path.comments || [];
  if (!path.comments.find(comment => comment.value.includes(text))) {
    path.comments.push(comment);
  }
};
