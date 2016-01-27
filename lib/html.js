var commonmark = require('commonmark')
  , through = require('through3');

function transform(chunk, encoding, cb){
  var writer = new commonmark.HtmlRenderer();
  this.push(writer.render(chunk));
  cb();
}

module.exports = through.transform(transform);
