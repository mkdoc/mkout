var assert = require('assert')
  , commonmark = require('commonmark')
  , through = require('through3')
  , fs = require('fs');

function transform(chunk, encoding, cb){
  assert(Array.isArray(chunk), 'cat: expects array of file');
  var scope = this
    , reader = new commonmark.Parser();
  chunk.forEach(function(file) {
    var contents = fs.readFileSync(file)
      , ast = reader.parse('' + contents);
    scope.push(ast);
  })
  cb();
}

module.exports = through.transform(transform);
