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
    console.dir(md)
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  //it('should render hard line break', function(done) {
    //var source = 'Foo  \n';
    //var reader = new commonmark.Parser();
    //var writer = new MarkdownRenderer();
    //var ast = reader.parse(source);
    //var md = writer.render(ast);
    //expect(md).to.be.a('string');
    //console.dir(md)
    //expect(md.indexOf('Foo\\\n')).to.eql(0);
    //done();
  //});

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

});