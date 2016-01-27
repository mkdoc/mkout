function mk3() {}

[
  'cat',
  'parse'
].forEach(function(name) {
  mk3[name] = function() {
    var Type = require('./' + name);
    return new Type();
  }
});

//function cat() {
  //var Concat = require('./cat')
  //return new Concat();
//}

//mk3.cat = cat;
//mk3.cat = parse;

module.exports = mk3;
