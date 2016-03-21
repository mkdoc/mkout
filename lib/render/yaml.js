"use strict";

var Renderer = require('commonmark/lib/render/renderer')
  , Node = require('mkast').Node
  , repeat = require('string-repeater');

function YamlRendererer(opts) {
  opts = opts || {};
  Renderer.call(this);
  this.indent = opts.indent || '  ';
  this.compact = opts.compact !== undefined ? opts.compact : true
}

function list(key, value, depth) {
  var val;
  if(key) {
    this.out(repeat(this.indent, depth + 1));
    this.out(key + ': '); 
    this.cr();
  }
  for(var i = 0;i < value.length;i++) {
    val = value[i];
    this.out(repeat(this.indent, depth + 2));
    this.out('- ');
    if(Array.isArray(val)) {
      val = '[' + val.join(', ') + ']';
    }
    this.out(val);  
    this.cr();
  }
}

function properties(node, depth) {

  var k, v;

  for(k in node) {
    v = node[k];
    k = k.replace(/^_/, '');
    //console.dir(k);
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

    if(Array.isArray(v)) {
      this.list(k, v, depth);
      //this.out(k + ': [' + v.join(', ') + ']'); 
    }else if(typeof v === 'boolean') {
       
    }else if(k === 'literal' && ~v.indexOf('\n')) {
      this.out(repeat(this.indent, depth + 1));
      this.out(k + ': |' + v); 
    }else{
      this.out(repeat(this.indent, depth + 1));
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
    this.out(type + ': ');
    if(this.compact && node._literal) {
      this.out(node._literal);
    }
    this.cr();

    if(!this.compact) {
      this.properties(node, depth);
    }

    if(Node.is(node, Node.DOCUMENT) && !entering) {
      this.out('---'); 
      this.cr();
    }

  }

  return this.buffer;
}

YamlRendererer.prototype = Object.create(Renderer.prototype);

YamlRendererer.prototype.render = render;
YamlRendererer.prototype.list = list;
YamlRendererer.prototype.properties = properties;

module.exports = YamlRendererer;
