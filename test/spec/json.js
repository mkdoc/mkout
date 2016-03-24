var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , JsonRenderer = require('../../lib/json');

function assert(obj) {
  expect(obj.type).to.eql(Node.DOCUMENT);
  expect(obj.firstChild.type).to.eql(Node.PARAGRAPH);
  expect(obj.firstChild.firstChild.type).to.eql(Node.TEXT);
  expect(obj.firstChild.firstChild.literal).to.eql('Text');
}

describe('json:', function() {

  var writer = new JsonRenderer();

  it('should render json', function(done) {
    var source = 'Text'
      , doc = ast.parse(source)
      , res = writer.render(doc)
      , obj = JSON.parse(res);
    assert(obj);
    done();
  });

  it('should render json w/ indent', function(done) {
    var writer = new JsonRenderer({indent: 1})
      , source = 'Text'
      , doc = ast.parse(source)
      , res = writer.render(doc)
      , obj = JSON.parse(res);
    assert(obj);
    done();
  });

});
