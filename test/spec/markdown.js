var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , MarkdownRenderer = require('../../lib/markdown');

describe('markdown:', function() {

  var writer = new MarkdownRenderer();

  it('should render level 1 heading', function(done) {
    var source = '# Heading (1)';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render level 1 setext heading', function(done) {
    var source = 'Heading\nthat spans\nmultiple lines\n===\n\n'
      , expected = 'Heading\nthat spans\nmultiple lines\n==============\n\n';
    var writer  = new MarkdownRenderer({setext: true})
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(expected);
    done();
  });

  it('should render level 6 heading', function(done) {
    var source = '###### Heading (6)';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render paragraph', function(done) {
    var source = 'Some paragraph text.';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render link', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render link with title', function(done) {
    var source = '[Commonmark](http://commonmark.org "Commonmark")';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render image with title', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png "Markdown")';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render html block', function(done) {
    var source = '<p>foo</p>';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render inline html', function(done) {
    var source = '<em>foo</em>';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render soft line break', function(done) {
    var source = 'foo\nbar';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  //it('should render hard line break', function(done) {
    //var source = 'foo  \nbar\n';
    //var md = writer.render(ast.parse(source);
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  it('should render inline code', function(done) {
    var source = '`code`';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render strong', function(done) {
    var source = '**strong**';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render emph', function(done) {
    var source = '*emph*';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render horizontal rule', function(done) {
    var source = '---';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render code block', function(done) {
    var source = '```javascript foo bar\nfunction(){}\n```';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render unordered list', function(done) {
    var source = '* foo\n* bar\n';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render ordered list (period)', function(done) {
    var source = '1. foo\n2. bar\n';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render blockquote', function(done) {
    var source = '> foo';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render custom block w/ no data', function(done) {
    var source = ''
      , expected = 'bar'
      , doc = ast.parse(source)
      , custom = Node.createNode(
          Node.CUSTOM_BLOCK, {});

    custom.appendChild(
      Node.createNode(Node.TEXT, {literal: 'bar'}))

    doc.appendChild(custom);

    var md = writer.render(doc);
    expect(md).to.eql(expected);
    done();
  });

  it('should render custom block w/ onEnter and onExit', function(done) {
    var source = ''
      , expected = '<foo>bar</foo>\n\n'
      , doc = ast.parse(source)
      , custom = Node.createNode(
          Node.CUSTOM_BLOCK, {onEnter: '<foo>', onExit: '</foo>'});

    custom.appendChild(
      Node.createNode(Node.TEXT, {literal: 'bar'}))

    doc.appendChild(custom);

    var md = writer.render(doc);
    expect(md).to.eql(expected);
    done();
  });

  it('should render custom inline w/ no data', function(done) {
    var source = ''
      , expected = 'bar'
      , doc = ast.parse(source)
      , custom = Node.createNode(
          Node.CUSTOM_INLINE, {});

    custom.appendChild(
      Node.createNode(Node.TEXT, {literal: 'bar'}))

    doc.appendChild(custom);

    var md = writer.render(doc);
    expect(md).to.eql(expected);
    done();
  });

  it('should render custom inline w/ onEnter and onExit', function(done) {
    var source = ''
      , expected = '<foo>bar</foo>'
      , doc = ast.parse(source)
      , custom = Node.createNode(
          Node.CUSTOM_INLINE, {onEnter: '<foo>', onExit: '</foo>'});

    custom.appendChild(
      Node.createNode(Node.TEXT, {literal: 'bar'}))

    doc.appendChild(custom);

    var md = writer.render(doc);
    expect(md).to.eql(expected);
    done();
  });

});
