var expect = require('chai').expect
  , ast = require('mkast')
  , TextRenderer = require('../../lib/text');

describe('text:', function() {

  var writer = new TextRenderer();

  it('should preserve level 1 heading', function(done) {
    var source = '# Heading (1)';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render level 1 heading (no preserve)', function(done) {
    var source = '# Heading (1)';
    var writer = new TextRenderer({preserve: {}});
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('Heading (1)\n\n');
    done();
  });

  it('should render autolinks', function(done) {
    var source = '[Commonmark](http://commonmark.org)'
      , expected = 'Commonmark[1]\n\n[1]: http://commonmark.org\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql(expected);
    done();
  });

  it('should render duplicate links (autolinks)', function(done) {
    var source = '[Commonmark](http://commonmark.org) '
        + '[Commonmark](http://commonmark.org)'
      , expected = 'Commonmark[1] Commonmark[1]\n\n'
        + '[1]: http://commonmark.org\n';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql(expected);
    done();
  });

  it('should preserve links w/ preserve option', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var writer = new TextRenderer({preserve: {link: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should preserve links w/ autolink disabled', function(done) {
    var source = '[Commonmark](http://commonmark.org)';
    var writer = new TextRenderer({autolink: false});
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should collapse soft line break', function(done) {
    var source = 'foo\nbar';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('foo bar\n\n');
    done();
  });

  it('should collapse soft line break without space injection', function(done) {
    var source = 'foo \nbar';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('foo bar\n\n');
    done();
  });

  it('should preserve soft line break', function(done) {
    var source = 'foo\nbar';
    var writer = new TextRenderer({preserve: {softbreak: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  it('should render paragraph', function(done) {
    var source = 'Text.';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('Text.\n\n');
    done();
  });

  it('should remove image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('Commonmark\n\n');
    done();
  });

  it('should preserve image', function(done) {
    var source = '![Commonmark]'
      + '(http://commonmark.org/images/markdown-mark.png)';
    var writer = new TextRenderer({preserve: {image: true}})
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md.indexOf(source)).to.eql(0);
    done();
  });

  //it('should render html block', function(done) {
    //var source = '<p>foo</p>';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  //it('should render inline html', function(done) {
    //var source = '<em>foo</em>';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  ////it('should render hard line break', function(done) {
    ////var source = 'foo  \nbar\n';
    ////var md = writer.render(ast.parse(source);
    ////expect(md).to.be.a('string');
    ////expect(md.indexOf(source)).to.eql(0);
    ////done();
  ////});

  it('should remove inline code', function(done) {
    var source = '`code`';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('code\n\n');
    done();
  });

  it('should preserve inline code', function(done) {
    var source = '`code`';
    var writer = new TextRenderer({preserve: {code: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('`code`\n\n');
    done();
  });

  it('should remove strong', function(done) {
    var source = '**strong**';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('strong\n\n');
    done();
  });

  it('should preserve strong', function(done) {
    var source = '**strong**';
    var writer = new TextRenderer({preserve: {strong: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('**strong**\n\n');
    done();
  });

  it('should remove emph', function(done) {
    var source = '*emph*';
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('emph\n\n');
    done();
  });

  it('should preserve emph', function(done) {
    var source = '*emph*';
    var writer = new TextRenderer({preserve: {emph: true}});
    var md = writer.render(ast.parse(source));
    expect(md).to.be.a('string');
    expect(md).to.eql('*emph*\n\n');
    done();
  });

  //it('should render horizontal rule', function(done) {
    //var source = '---';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  //it('should render code block', function(done) {
    //var source = '```javascript foo bar\nfunction(){}\n```';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  //it('should render unordered list', function(done) {
    //var source = '* foo\n* bar\n';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  //it('should render ordered list (period)', function(done) {
    //var source = '1. foo\n2. bar\n';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  //it('should render blockquote', function(done) {
    //var source = '> foo';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

  //it('should render custom block', function(done) {
    //var source = '<component>\nfoo\n</component>';
    //var md = writer.render(ast.parse(source));
    //expect(md).to.be.a('string');
    //expect(md.indexOf(source)).to.eql(0);
    //done();
  //});

});
