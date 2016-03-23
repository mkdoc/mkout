var expect = require('chai').expect
  , ast = require('mkast')
  , MarkdownRenderer = require('../../lib/markdown');

describe('mkout:', function() {

  it('should render level 1 heading', function(done) {
    var source = '# Heading (1)';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render level 6 heading', function(done) {
    var source = '###### Heading (6)';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render paragraph', function(done) {
    var source = 'Some paragraph text.';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render link', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render link with title', function(done) {
    var source = '[Commonmark](http://commonmark.org "Commonmark")';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render image with title', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png "Markdown")';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render html block', function(done) {
    var source = '<p>foo</p>';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render inline html', function(done) {
    var source = '<em>foo</em>';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render soft line break', function(done) {
    var source = 'foo\nbar';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  //it('should render hard line break', function(done) {
    //var source = 'foo  \nbar\n';
    //var writer = new MarkdownRenderer();
    //var md = writer.render(ast.parse(source);
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  it('should render inline code', function(done) {
    var source = '`code`';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render strong', function(done) {
    var source = '**strong**';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render emph', function(done) {
    var source = '*emph*';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render horizontal rule', function(done) {
    var source = '---';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render code block', function(done) {
    var source = '```javascript foo bar\nfunction(){}\n```';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render unordered list', function(done) {
    var source = '* foo\n* bar\n';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render ordered list (period)', function(done) {
    var source = '1. foo\n2. bar\n';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render blockquote', function(done) {
    var source = '> foo';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render custom block', function(done) {
    var source = '<component>\nfoo\n</component>';
    var writer = new MarkdownRenderer();
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

});
