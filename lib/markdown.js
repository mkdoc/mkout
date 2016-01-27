var through = require('through3')
  , MarkdownRenderer = require('./render/markdown');

function transform(chunk, encoding, cb){
  var writer = new MarkdownRenderer();
  this.push(writer.render(chunk));
  cb();
}

module.exports = through.transform(transform);
