var circular = require('circular')
  , through = require('through3')

function transform(chunk, encoding, cb){
  this.push(JSON.stringify(chunk, circular(), 2));
  cb();
}

module.exports = through.transform(transform);
