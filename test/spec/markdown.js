var expect = require('chai').expect
  , fs = require('fs')
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

  it('should render level 2 setext heading', function(done) {
    var source = 'Heading\nthat spans\nmultiple lines\n---\n\n'
      , expected = 'Heading\nthat spans\nmultiple lines\n--------------\n\n';
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

  it('should render code block without info string', function(done) {
    var source = '```\nCode example\n```';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(source + '\n\n');
    done();
  });

  it('should render code block', function(done) {
    var source = '```javascript foo bar\nfunction(){}\n```';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render unordered list', function(done) {
    var source = '* foo\n* bar\n\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(source);
    done();
  });

  it('should render ordered list (period)', function(done) {
    var source = '1. foo\n2. bar\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(source);
    done();
  });

  it('should render nested list', function(done) {
    var source = '' + fs.readFileSync('test/fixtures/nested-list.md');
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(source);
    done();
  });

  it('should render nested compact list', function(done) {
    var source = '' + fs.readFileSync(
      'test/fixtures/nested-compact-list.md');
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(source);
    done();
  });

  it('should render nested list w/ last line blank', function(done) {
    var source = '' + fs.readFileSync(
      'test/fixtures/nested-list-last-line-blank.md');
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(source);
    done();
  });

  it('should render blockquote', function(done) {
    var source = '> foo';
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render link references', function(done) {
    var source = ''
      , expected = '[example]: http://example.com "Example Website"'
      , doc = ast.parse(source)
      , custom = Node.createNode(
          Node.LINK, {
            _linkType: 'ref',
            title: 'Example Website',
            destination: 'http://example.com'});

    custom.appendChild(
      Node.createNode(Node.TEXT, {literal: 'example'}))

    doc.appendChild(custom);

    var md = writer.render(doc);
    expect(md).to.eql(expected);
    done();
  });

  it('should render multiple link references', function(done) {
    var source = ''
      , expected = '[a]: http://a.com\n[b]: http://b.com'
      , doc = ast.parse(source)
      , a
      , b;

    a = Node.createNode(
      Node.LINK, {
        _linkType: 'ref',
        destination: 'http://a.com'});

    a.appendChild(
      Node.createNode(Node.TEXT, {literal: 'a'}))

    b = Node.createNode(
      Node.LINK, {
        _linkType: 'ref',
        destination: 'http://b.com'});

    b.appendChild(
      Node.createNode(Node.TEXT, {literal: 'b'}))

    doc.appendChild(a);
    doc.appendChild(b);

    var md = writer.render(doc);
    expect(md).to.eql(expected);
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
