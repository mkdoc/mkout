var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , TextRenderer = require('../../lib/text');

describe('text:', function() {

  var writer = new TextRenderer();

  it('should preserve level 1 heading', function(done) {
    var source = '# Heading (1)';
    var writer = new TextRenderer({preserve: {heading: true}});
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render level 1 heading (no preserve)', function(done) {
    var source = '# Heading (1)';
    var writer = new TextRenderer({preserve: {}});
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('Heading (1)\n\n');
    done();
  });

  it('should render autolinks', function(done) {
    var source = '[Commonmark](http://commonmark.org)'
      , expected = 'Commonmark[1]\n\n[1]: http://commonmark.org\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(expected);
    done();
  });

  it('should render duplicate links (autolinks)', function(done) {
    var source = '[Commonmark](http://commonmark.org) '
        + '[Commonmark](http://commonmark.org)'
      , expected = 'Commonmark[1] Commonmark[1]\n\n'
        + '[1]: http://commonmark.org\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(expected);
    done();
  });

  it('should preserve links w/ preserve option', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var writer = new TextRenderer({preserve: {link: true}});
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should preserve links w/ autolink disabled', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var writer = new TextRenderer({autolink: false});
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should collapse soft line break', function(done) {
    var source = 'foo\nbar';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('foo bar\n\n');
    done();
  });

  it('should collapse soft line break no space injection', function(done) {
    var source = 'foo \nbar';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('foo bar\n\n');
    done();
  });

  it('should preserve soft line break', function(done) {
    var source = 'foo\nbar';
    var writer = new TextRenderer({preserve: {softbreak: true}});
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render paragraph', function(done) {
    var source = 'Text.';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('Text.\n\n');
    done();
  });

  it('should remove image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('Commonmark\n\n');
    done();
  });

  it('should preserve image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var writer = new TextRenderer({preserve: {image: true}})
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should normalize html block', function(done) {
    var source = '<p>foo</p>';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('foo\n\n');
    done();
  });

  it('should preserve html block', function(done) {
    var source = '<p>foo</p>';
    var writer = new TextRenderer({preserve: {html_block: true}});
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should remove inline html', function(done) {
    var source = '<em>foo</em>';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('foo\n\n');
    done();
  });

  it('should preserve inline html', function(done) {
    var source = '<em>foo</em>';
    var writer = new TextRenderer({preserve: {html_inline: true}});
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render linebreak', function(done) {
    var source = 'foo  \nbar\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('foo\nbar\n\n');
    done();
  });

  it('should preserve linebreak', function(done) {
    var source = 'foo  \nbar\n';
    var writer = new TextRenderer(
      {linebreak: '  ', preserve: {linebreak: true}})
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should remove inline code', function(done) {
    var source = '`code`';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('code\n\n');
    done();
  });

  it('should preserve inline code', function(done) {
    var source = '`code`';
    var writer = new TextRenderer({preserve: {code: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('`code`\n\n');
    done();
  });

  it('should remove strong', function(done) {
    var source = '**strong**';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('strong\n\n');
    done();
  });

  it('should preserve strong', function(done) {
    var source = '**strong**';
    var writer = new TextRenderer({preserve: {strong: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('**strong**\n\n');
    done();
  });

  it('should remove emph', function(done) {
    var source = '*emph*';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('emph\n\n');
    done();
  });

  it('should preserve emph', function(done) {
    var source = '*emph*';
    var writer = new TextRenderer({preserve: {emph: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('*emph*\n\n');
    done();
  });

  it('should render thematic break', function(done) {
    var source = '---';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(writer.hr + '\n\n');
    done();
  });

  it('should preserve thematic break', function(done) {
    var source = '---';
    var writer = new TextRenderer({preserve: {thematic_break: true}})
    var md = writer.render(ast.parse(source));
    expect(md).to.eql(source + '\n\n');
    done();
  });

  it('should indent code block', function(done) {
    var source = '```javascript foo bar\nfunction(){}\n```';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('    function(){}\n\n');
    done();
  });

  it('should indent code block w/ lastLineBlank', function(done) {
    var source = '```\nCode example\n```\n\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('    Code example\n\n');
    done();
  });

  it('should preserve code block', function(done) {
    var source = '```javascript foo bar\nfunction(){}\n```';
    var writer = new TextRenderer({preserve: {code_block: true}});
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should indent blockquote', function(done) {
    var source = '> foo';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('    | foo\n\n');
    done();
  });

  it('should indent multi-line blockquote', function(done) {
    var source = '> foo\n> bar';
    var md = writer.render(ast.parse(source));
    expect(md).to.eql('    | foo\n    | bar\n\n');
    done();
  });

  it('should preserve blockquote', function(done) {
    var source = '> foo';
    var writer = new TextRenderer({preserve: {block_quote: true}})
    var md = writer.render(ast.parse(source));
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should remove custom block', function(done) {
    var source = ''
      , doc = ast.parse(source);

    doc.appendChild(
      Node.createNode(Node.CUSTOM_BLOCK, {onEnter: '<foo>', onExit: '</foo>'}));

    var md = writer.render(doc);
    expect(md).to.eql('');
    done();
  });

  it('should preserve custom block', function(done) {
    var source = ''
      , expected = '<foo>bar</foo>\n\n'
      , doc = ast.parse(source)
      , custom = Node.createNode(
          Node.CUSTOM_BLOCK, {onEnter: '<foo>', onExit: '</foo>'});

    custom.appendChild(
      Node.createNode(Node.TEXT, {literal: 'bar'}))

    doc.appendChild(custom);

    var writer = new TextRenderer({preserve: {custom_block: true}});
    var md = writer.render(doc);
    expect(md).to.eql(expected);
    done();
  });

  it('should remove custom inline', function(done) {
    var source = ''
      , doc = ast.parse(source);

    doc.appendChild(
      Node.createNode(
        Node.CUSTOM_INLINE, {onEnter: '<foo>', onExit: '</foo>'}));

    var md = writer.render(doc);
    expect(md).to.eql('');
    done();
  });

  it('should preserve custom inline', function(done) {
    var source = ''
      , expected = '<foo>bar</foo>'
      , doc = ast.parse(source)
      , custom = Node.createNode(
          Node.CUSTOM_INLINE, {onEnter: '<foo>', onExit: '</foo>'});

    custom.appendChild(
      Node.createNode(Node.TEXT, {literal: 'bar'}))

    doc.appendChild(custom);

    var writer = new TextRenderer({preserve: {custom_inline: true}});
    var md = writer.render(doc);
    expect(md).to.eql(expected);
    done();
  });

});
