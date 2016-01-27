module.exports = {};

[
  'cat',
  'parse'
].forEach(function(name) {
  module.exports[name] = function() {
    var Type = require('./' + name);
    return new Type();
  }
});

