module.exports = {
  // "ignorePatterns": ["temp.js", "**/vendor/*.js"],
  '*.{json,css,scss,html}': ['prettier --write --max-warnings=0', 'git add'],
  '*.js': ['eslint --fix --max-warnings=1 --no-ignore', 'git add'],
};
