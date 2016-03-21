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

function str(key, value, depth) {
  if(!value) {
    return; 
  }
  var hasNewline = Boolean(~value.indexOf('\n'))
    , indent = repeat(this.indent, depth + 2);

  function prefix(val) {
    var lines = val.split('\n')
      , out = '';

    lines.forEach(function(line, index) {
      out += indent + line + (index < lines.length - 1 ? '\n' : '');
    })

    return out;
  }

  if(hasNewline) {
    this.out('|'); 
    this.cr();
    this.out(prefix(value));
  }else{
    this.out("'" + value + "'");
  }
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

  this.out(repeat(this.indent, depth + 1));
  this.out('- properties: '); 
  this.cr();
  depth++;

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
    }else if(typeof v === 'string') {
      this.out(repeat(this.indent, depth + 1));
      this.out(k + ': '); 
      this.str(k, v, depth);
    }else if(typeof v === 'boolean') {
      this.out(repeat(this.indent, depth + 1));
      this.out(k + ': ' + (v ? 'yes' : 'no')); 
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
    , isDoc
    , type
    , depth
    , p;

  this.buffer = '';
  this.lastOut = '\n';

  while((event = walker.next())) {
    entering = event.entering;
    node = event.node;
    isDoc = Node.is(node, Node.DOCUMENT);
    type = node.type;
    depth = 0;
    p = node.parent;

    while(p) {
      depth++;
      p = p.parent; 
    }

    // open document
    if(isDoc && entering) {
      this.out('---'); 
      this.cr();
    }

    //console.error(depth);

    this.out(repeat(this.indent, depth));

    //if(!isDoc) {
      this.out('- '); 
    //}

    this.out(type + ': ');
    if(this.compact && node._literal) {
      this.str(type, node._literal, depth);
    }
    this.cr();

    if(!this.compact && !isDoc) {
      this.properties(node, depth);
    }

    // close document
    if(isDoc && !entering) {
      this.out('---'); 
      this.cr();
    }

  }

  return this.buffer;
}

YamlRendererer.prototype = Object.create(Renderer.prototype);

YamlRendererer.prototype.render = render;
YamlRendererer.prototype.list = list;
YamlRendererer.prototype.str = str;
YamlRendererer.prototype.properties = properties;

module.exports = YamlRendererer;
