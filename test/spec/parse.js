var expect = require('chai').expect
  , mk3 = require('../../lib/mk3')

describe('cdb:', function() {

  it('should parse native string to ast', function(done) {
    var parser = mk3.parse();
    parser.on('data', function onData(data) {
      expect(data.type).to.eql('Document');
    })
    parser.on('finish', function onFinish() {
      done();
    })
    parser.end('# Heading (1)');
  });

});
