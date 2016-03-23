"use strict";

var Renderer = require('./markdown')
  , repeat = require('string-repeater');

function TextRenderer(opts) {
  opts = opts || {};
  Renderer.apply(this, arguments);
  this.links = [];
  this.preserve = opts.preserve || {};
}

function text(node) {
  this.out(node.literal);
}

function softbreak() {
  this.cr();
}

function hardbreak() {
  this.out(this.options.hardbreak);
  this.cr();
}

function link(node, entering) {
  if(this.preserve[node.type]) {
    return Renderer.prototype[node.type].call(this, node, entering); 
  }

  if(entering) {
    this.links.push(node);
  }
}

function image(node, entering) {
  if(this.preserve[node.type]) {
    return Renderer.prototype[node.type].call(this, node, entering); 
  }
}

function emph() {
  this.out(this.options.emph);
}

function strong() {
  this.out(this.options.strong);
}

function paragraph(node, entering) {
  var grandparent = node.parent ? node.parent.parent : null;
  if(grandparent
      && grandparent.type === 'list'
      && grandparent.listTight) {
        return;
  }

  if(!entering) {
    this.cr(2);
  }
}

function heading(node, entering) {
  if(this.preserve[node.type]) {
    return Renderer.prototype[node.type].call(this, node, entering); 
  }
  if(!entering) {
    this.cr(2);
  }
}

function code(node) {
  this.out('`' + node.literal + '`');
}

function code_block(node) {
  var info = node.info || '';
  // @todo: should we append a newline to literal when it does not finish
  // @todo: with a newline?
  this.out(
    '```' + info + this.newline + node.literal + '```');
  this.cr(2);
}

function thematic_break() {
  this.out(this.options.thematicbreak);
  this.cr(2);
}

function block_quote(node, entering) {
  if(entering) {
    this.out('> '); 
  }
}

function list(node, entering) {
  if(!entering) {
    if(node.next && node.next.type === 'list') {
      return;
    }
    this.cr();
  }
}

function item(node, entering) {
  if(entering) {
    if(node._listData.markerOffset) {
      this.out(repeat(' ', node._listData.markerOffset)); 
    }

    this.out(node._listData.type === 'ordered'
      ? (node._listData.start) + node._listData.delimiter + ' '
      : node._listData.bulletChar + ' ');

  }else{
    this.cr();
  }
}

function html_block(node) {
  this.out(node.literal);
  this.cr(2);
}

function custom_inline(node, entering) {
  if(entering && node.onEnter) {
    this.out(node.onEnter);
  }else if(!entering && node.onExit) {
    this.out(node.onExit);
  }
}

function custom_block(node, entering) {
  if(entering && node.onEnter) {
    this.out(node.onEnter);
  }else if(!entering && node.onExit) {
    this.out(node.onExit);
  }
  this.cr(2);
}

/* Helper methods */

function literal(node) {
  this.lit(node.literal);
}

TextRenderer.prototype = Object.create(Renderer.prototype);

TextRenderer.prototype.text = text;
TextRenderer.prototype.html_inline = literal;
TextRenderer.prototype.html_block = html_block;
TextRenderer.prototype.softbreak = softbreak;
TextRenderer.prototype.linebreak = hardbreak;
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
