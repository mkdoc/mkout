"use strict";

var ast = require('mkast')
  , Renderer = require('./markdown')
  , Node = ast.Node
  //, repeat = require('string-repeater');

function TextRendererer(opts) {
  opts = opts || {};
  Renderer.call(this);
}

function text(node) {
  if(node.literal) {
    this.out(node.literal); 
  }
}

function render(ast) {
  var walker = ast.walker()
    , event
    , entering
    , node
    , type;

  this.buffer = '';
  this.lastOut = '\n';

  while((event = walker.next())) {
    entering = event.entering;
    node = event.node;
    type = node.type;
    // always preserve text nodes
    if(entering) {
      if(node.literal) {
        this.text(node); 
      }
      
    }else{
    
      if(Node.is(node, Node.PARAGRAPH) || Node.is(node, Node.HEADING)) {
        this.cr(2); 
        //this.cr(); 
      }
    }
  }

  return this.buffer;
}

TextRendererer.prototype = Object.create(Renderer.prototype);

TextRendererer.prototype.render = render;
TextRendererer.prototype.text = text;

module.exports = TextRendererer;
