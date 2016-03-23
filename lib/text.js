"use strict";

var Renderer = require('./markdown')
  , ast = require('mkast')
  , Node = ast.Node
  , prefix = require('./prefix-lines')
  , proto = Renderer.prototype;

function TextRenderer(opts) {
  opts = opts || {};
  Renderer.apply(this, arguments);

  // automatically convert links to numbered references
  this.autolink = opts.autolink !== undefined ? opts.autolink : true;

  // list of links encountered during the render
  this.links = [];

  // map of link destinations to array index
  this.destinations = {};

  // indentation for code blocks
  this.indent = opts.indent || '  ';

  // map of node types to preserve as markdown
  this.preserve = opts.preserve || {heading: true, list: true, item: true};
}

function document(node, entering) {
  if(!entering && this.autolink) {
    // print link references by index
    for(var i = 0;i < this.links.length;i++) {
      this.out('[' + (i + 1) + ']: ' + this.links[i].destination); 
      this.cr();
    }
  }
}

function text(node) {
  if(!this.autolink) {
    return this.out(node.literal); 
  }

  var p = node.parent
    , dest = '';

  // NOTE: this captures link parents when the hierarchy is:
  // NOTE: link > image > text
  while(p) {
    if(Node.is(p, Node.LINK)) {
      dest = p.destination;
      break;
    }
    p = p.parent;
  }

  if(dest) {
    this.out(node.literal + '[' + (this.destinations[dest] + 1) + ']');
  }else{
    this.out(node.literal);
  }
}

function softbreak() {
  this.cr();
}

function linebreak(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  this.cr();
}

function link(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  // track links in the document, so that they can be printed
  // when the document is closed and so that the `text` handling
  // can append a link index to the literal in the form: link[1]
  if(this.autolink 
    && entering
    && this.destinations[node.destination] === undefined) {
    this.links.push(node);
    this.destinations[node.destination] = this.links.length - 1;
  }
}

function image(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function emph(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function strong(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function paragraph(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  var grandparent = node.parent ? node.parent.parent : null;
  if(grandparent
      && Node.is(grandparent, Node.LIST)
      && grandparent.listTight) {
        return;
  }

  if(!entering) {
    this.cr(2);
  }
}

function heading(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  if(!entering) {
    this.cr(2);
  }
}

function code(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  this.out(node.literal);
}

function code_block(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  var str = node.literal;
  str = prefix(node, str, this.indent);
  this.out(str);

  if(!node.lastLineBlank) {
    this.cr();
  }
}

function thematic_break(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  this.out(this.options.thematicbreak);
  this.cr(2);
}

function block_quote(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function list(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  if(!entering) {
    if(node.next && node.next.type === 'list') {
      return;
    }
    this.cr();
  }
}

function item(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  if(!entering) {
    this.cr();
  }
}

function html_block(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  if(entering) {
    this.out(node.literal);
  }else{
    this.cr(2);
  }
}

function html_inline(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  if(entering) {
    this.lit(node.literal);
  }
}


function custom_inline(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  if(entering && node.onEnter) {
    this.out(node.onEnter);
  }else if(!entering && node.onExit) {
    this.out(node.onExit);
  }
}

function custom_block(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  this.custom_inline(node, entering);
  this.cr(2);
}

TextRenderer.prototype = Object.create(proto);

TextRenderer.prototype.document = document;
TextRenderer.prototype.text = text;
TextRenderer.prototype.html_inline = html_inline;
TextRenderer.prototype.html_block = html_block;
TextRenderer.prototype.softbreak = softbreak;
TextRenderer.prototype.linebreak = linebreak;
TextRenderer.prototype.link = link;
TextRenderer.prototype.image = image;
TextRenderer.prototype.emph = emph;
TextRenderer.prototype.strong = strong;
TextRenderer.prototype.paragraph = paragraph;
TextRenderer.prototype.heading = heading;
TextRenderer.prototype.code = code;
TextRenderer.prototype.code_block = code_block;
TextRenderer.prototype.thematic_break = thematic_break;
TextRenderer.prototype.block_quote = block_quote;
TextRenderer.prototype.list = list;
TextRenderer.prototype.item = item;
TextRenderer.prototype.custom_inline = custom_inline;
TextRenderer.prototype.custom_block = custom_block;

module.exports = TextRenderer;
