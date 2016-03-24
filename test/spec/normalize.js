var expect = require('chai').expect
  , normalize = require('../../lib/normalize');

describe('normalize:', function() {

  it('should strip simple tag', function(done) {
    var source = '<a>link</a>'
      , result = normalize(source);
    expect(result).to.eql('link');
    done();
  });

  it('should strip end tag', function(done) {
    var source = '</section>'
      , result = normalize(source);
    expect(result).to.eql('');
    done();
  });

  it('should strip nested tags', function(done) {
    var source = '<em>emph with some <strong>strong</strong></em>'
      , result = normalize(source);
    expect(result).to.eql('emph with some strong');
    done();
  });

  it('should strip self-closing tag', function(done) {
    var source = '<img src="" /> foo'
      , result = normalize(source);
    expect(result).to.eql(' foo');
    done();
  });

  it('should preserve bad end tag', function(done) {
    var source = '<component>>'
      , result = normalize(source);
    expect(result).to.eql('>');
    done();
  });

  it('should normalize whitespace', function(done) {
    var source = '<div>\n\t<a>link</a>\n</div>'
      , result = normalize(source);
    expect(result).to.eql('link');
    done();
  });

  it('should collapse space characters', function(done) {
    var source = 'this is a <a> link</a>'
      , result = normalize(source);
    expect(result).to.eql('this is a link');
    done();
  });

});
