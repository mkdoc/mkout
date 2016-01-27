var assert = require('assert')
  , commonmark = require('commonmark')
  , through = require('through3');

function transform(chunk, encoding, cb){
  assert(typeof chunk === 'string' || (chunk instanceof String),
    'parse: expects string markdown to parse');
  var reader = new commonmark.Parser()
  this.push(reader.parse(chunk));
  cb();
}

module.exports = through.transform(transform);
