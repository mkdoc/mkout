"use strict";

var ast = require('mkast')
  , Renderer = ast.Renderer
  , Node = ast.Node
  , repeat = require('string-repeater');

function YamlRendererer(opts) {
  opts = opts || {};
  Renderer.call(this);
  this.indent = opts.indent || '  ';
  this.compact = opts.compact !== undefined ? opts.compact : true
}

function str(node, key, value, depth) {

  // empty string
  if(!value) {
    this.cr();
    return; 
  }

  var hasNewline = Boolean(~value.indexOf('\n'))
    , indent = repeat(this.indent, depth + 2);

  function prefix(val) {
    var lines = val.split('\n')
      , out = '';

    lines.forEach(function(line, index) {

      // empty last line
      if(!line && index === lines.length - 1 && node.lastLineBlank) {
        return; 
      }

      out += indent + line;
      if(index < lines.length - 1) {
        out += '\n';
      }
    })

    return out;
  }

  if(hasNewline) {
    this.out('|'); 
    this.cr();
    this.out(prefix(value));
    if(!node.lastLineBlank) {
      this.cr();
    }
  }else{
    this.out("'" + value + "'");
    this.cr();
  }
}

function map(node, key, value, depth) {
  var k, sent;
  for(k in value) {
    if(!sent) {
      this.out(repeat(this.indent, depth + 1));
      this.out(key + ':');
      this.cr();
      depth++;
      sent = true;
    } 
    this.serialize(node, k, value[k], depth);
  }
}

function sourcepos(node, key, value, depth) {
  if(key) {
    this.out(repeat(this.indent, depth + 1));
    this.out(key + ': '); 
  }

  var start = '[' + value[0].join(', ') + ']'
    , end = '[' + value[1].join(', ') + ']';

  this.out('[' + start + ', ' + end + ']');
  this.cr();
}

function list(node, key, value, depth) {
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

function serialize(node, k, v, depth) {

  if(v === null) {
    return; 
  }

  if(Array.isArray(v)) {
    if(k === 'sourcepos') {
      this.sourcepos(node, k, v, depth); 
    }else{
      this.list(node, k, v, depth);
    }
  }else if(v && typeof v === 'object') {
    this.map(node, k, v, depth);
  }else if(typeof v === 'string') {
    this.out(repeat(this.indent, depth + 1));
    this.out(k + ': '); 
    // NOTE: strings take care of final newline
    return this.str(node, k, v, depth);
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

function properties(node, depth) {
  var k, v;

  this.out(repeat(this.indent, depth + 1));
  this.out('- properties: '); 
  this.cr();
  depth += 2;

  // get us all the public properties
  node = Node.serialize(node);

  for(k in node) {
    v = node[k];
    if(k === 'type'
        || k === 'firstChild'
        || k === 'next'
        || v === undefined
        || v === null) {
      continue; 
    }
    this.serialize(node, k, v, depth);
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

    if(entering) {
      this.out(repeat(this.indent, depth));

      this.out('- '); 

      this.out(type + ': ');
      if(this.compact && node.literal) {
        this.str(Node.serialize(node), type, node.literal, depth);
      }else{
        this.cr();
      }

      if(!this.compact) {
        this.properties(node, depth);
      }
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
YamlRendererer.prototype.map = map;
YamlRendererer.prototype.str = str;
YamlRendererer.prototype.sourcepos = sourcepos;
YamlRendererer.prototype.properties = properties;
YamlRendererer.prototype.serialize = serialize;

module.exports = YamlRendererer;
