module.exports = {
  hooks: {
    'commit-msg': 'commitlint -e $HUSKY_GIT_PARAMS',
    'pre-commit': 'pretty-quick --staged && eslint --max-warnings=0 ./src',
    'pre-push': 'yarn test --watchAll=false'
  }
};
