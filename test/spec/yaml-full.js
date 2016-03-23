var expect = require('chai').expect
  , ast = require('mkast')
  , YamlRenderer = require('../../lib/yaml')
  , yaml = require('js-yaml');

function assert(yml, done) {
  expect(yml).to.be.a('string');
  yaml.safeLoadAll(yml, function(doc) {
    // sends null document when no more docs to process
    if(doc !== null) {
      //console.dir(doc);
      expect(doc).to.be.an('array');
      expect(doc[0]).to.be.an('object');
      expect(doc[0].document).to.be.an('array');
    }else{
      done();
    }
  });
}

describe('yaml full:', function() {

  var writer = new YamlRenderer({compact: false});

  it('should render level 1 heading', function(done) {
    var source = '# Heading (1)';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render level 6 heading', function(done) {
    var source = '###### Heading (6)';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render paragraph', function(done) {
    var source = 'Some paragraph text.';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render link', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render link with title', function(done) {
    var source = '[Commonmark](http://commonmark.org "Commonmark")';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render image with title', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png "Markdown")';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render html block', function(done) {
    var source = '<p>foo</p>';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render inline html', function(done) {
    var source = '<em>foo</em>';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render soft line break', function(done) {
    var source = 'foo\nbar';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render hard line break', function(done) {
    var source = 'foo  \nbar\n';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render inline code', function(done) {
    var source = '`code`';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render strong', function(done) {
    var source = '**strong**';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render emph', function(done) {
    var source = '*emph*';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render horizontal rule', function(done) {
    var source = '---';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render code block', function(done) {
    var source = '```javascript foo bar\nfunction(){}\n```';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render unordered list', function(done) {
    var source = '* foo\n* bar\n';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render ordered list (period)', function(done) {
    var source = '1. foo\n2. bar\n';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render blockquote', function(done) {
    var source = '> foo';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

  it('should render custom block', function(done) {
    var source = '<component>\nfoo\n</component>';
    var yml = writer.render(ast.parse(source));
    assert(yml, done);
  });

});
