var expect = require('chai').expect
  , mk3 = require('../../lib/mk3')

describe('cdb:', function() {

  it('should cat single file to ast', function(done) {
    var concat = mk3.cat();
    concat.on('data', function onData(data) {
      expect(data.type).to.eql('Document');
    })
    concat.on('finish', function onFinish() {
      done();
    })
    concat.end(['test/fixtures/heading.md']);
  });

});
