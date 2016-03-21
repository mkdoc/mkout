"use strict";

var Renderer = require('commonmark/lib/render/renderer')
  , Node = require('mkast').Node
  , repeat = require('string-repeater');

function YamlRendererer(options) {
  options = options || {};
  Renderer.call(this);
  this.indent = '  ';
}

function properties(node, depth) {

  var k, v;

  for(k in node) {
    v = node[k];
    k = k.replace(/^_/, '');
    if(k === 'type'
        || k === 'firstChild'
        || k === 'lastChild'
        || k === 'next'
        || k === 'prev'
        || k === 'parent'
        || v === undefined
        || v === null
        || typeof v === 'function') {
      continue; 
    }

    this.out(repeat(this.indent, depth + 2));
    if(k === 'literal' && ~v.indexOf('\n')) {
      this.out(k + ': |' + v); 
    }else{
      this.out(k + ': ' + v); 
    }
    this.cr();
  }
}

function render(ast) {
  var walker = ast.walker()
    , event
    , entering
    , node
    , type
    , depth
    , p;

  this.buffer = '';
  this.lastOut = '\n';

  while((event = walker.next())) {
    entering = event.entering;
    node = event.node;
    type = node.type;
    depth = 0;
    p = node.parent;

    while(p) {
      depth++;
      p = p.parent; 
    }

    if(Node.is(node, Node.DOCUMENT) && entering) {
      this.out('---'); 
      this.cr();
    }

    //console.error(depth);


    this.out(repeat(this.indent, depth));
    if(!Node.is(node, Node.DOCUMENT)) {
      this.out('- '); 
    }
    this.out(type + ':');
    this.cr();
    this.properties(node, depth);

    if(Node.is(node, Node.DOCUMENT) && !entering) {
      this.out('---'); 
      this.cr();
    }

  }

  return this.buffer;
}

YamlRendererer.prototype = Object.create(Renderer.prototype);

YamlRendererer.prototype.render = render;
YamlRendererer.prototype.properties = properties;

module.exports = YamlRendererer;
