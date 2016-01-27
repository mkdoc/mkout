var commonmark = require('commonmark');

/* istanbul ignore next: debug utility */
function dump(ast) {
  console.log((new commonmark.XmlRenderer()).render(ast));
}

module.exports = dump;
