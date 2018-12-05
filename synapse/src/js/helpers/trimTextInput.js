module.exports = textInput => (
  textInput.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
);
