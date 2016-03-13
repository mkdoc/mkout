var expect = require('chai').expect
  , commonmark = require('commonmark')
  , MarkdownRenderer = require('../../lib/render/markdown')

describe('cdb:', function() {

  it('should render level 1 heading', function(done) {
    var source = '# Heading (1)';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    //console.dir(md)
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render level 6 heading', function(done) {
    var source = '###### Heading (6)';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render paragraph', function(done) {
    var source = 'Some paragraph text.';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render link', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render link with title', function(done) {
    var source = '[Commonmark](http://commonmark.org "Commonmark")';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render image with title', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png "Markdown")';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render html block', function(done) {
    var source = '<p>foo</p>';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render inline html', function(done) {
    var source = '<em>foo</em>';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render soft line break', function(done) {
    var source = 'foo\nbar';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render hard line break', function(done) {
    var source = 'foo  \nbar\n';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    //console.dir(md)
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render inline code', function(done) {
    var source = '`code`';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render strong', function(done) {
    var source = '**strong**';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render emph', function(done) {
    var source = '*emph*';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render horizontal rule', function(done) {
    var source = '---';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render code block', function(done) {
    var source = '```javascript foo bar\nfunction(){}\n```';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render unordered list', function(done) {
    var source = '* foo\n* bar\n';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render ordered list (period)', function(done) {
    var source = '1. foo\n2. bar\n';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render blockquote', function(done) {
    var source = '> foo';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render custom block', function(done) {
    var source = '<component>\nfoo\n</component>';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    var md = writer.render(ast);
    expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should throw error on unknown node type', function(done) {
    var source = '> foo';
    var reader = new commonmark.Parser();
    var writer = new MarkdownRenderer();
    var ast = reader.parse(source);
    ast._type = 'UnknownDocument';
    function fn() {
      writer.render(ast);
    }
    expect(fn).throws(Error);
    expect(fn).throws(/unknown node type/i);
    done();
  });

});
