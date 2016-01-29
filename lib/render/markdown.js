"use strict";

var Renderer = require('./renderer')
  , repeat = require('../repeat');

function MarkdownRenderer(options) {
  options = options || {};

  // set to two spaces ('  ') for the alternative style hard line break
  options.hardbreak = options.hardbreak || '\\';

  // set to underscore for the emphasis variant
  options.emph = options.emph || '*';

  // set to two underscores for the strong variant
  options.strong = options.strong || '**';

  // set to asterisks ('***') or an alternative
  options.thematicbreak = options.thematicbreak || '---';

  this.options = options;
  this.newline = options.newline || '\n';
  this.inBlockQuote = false;
}

/* Node methods */

function text(event, node) {
  if(this.inBlockQuote) {
    this.out('> ' + node.literal);
  }else{
    this.out(node.literal);
  }
}

function softbreak() {
  this.cr();
}

function hardbreak() {
  this.out(this.options.hardbreak);
  this.cr();
}

function link(event, node, entering) {
  if(entering) {
    this.out('[');
  }else{
    this.out('](' + node.destination
      + (node.title ? ' "' + node.title + '")' : ')'));
  }
}

function image(event, node, entering) {
  if(entering) {
    this.out('![');
  }else{
    this.out('](' + node.destination
      + (node.title ? ' "' + node.title + '")' : ')'));
  }
}

function emph() {
  this.out(this.options.emph);
}

function strong() {
  this.out(this.options.strong);
}

function paragraph(event, node, entering) {
  var grandparent = node.parent.parent;
  if(grandparent !== null &&
      grandparent.type === 'List') {
      if (grandparent.listTight) {
          return;
      }
  }
  if(!entering) {
    this.cr(2);
  }
}

function heading(event, node, entering) {
  if(entering) {
    this.out(repeat('#', node.level) + ' ');
  }else{
    this.cr(2);
  }
}

function code(event, node) {
  this.out('`' + node.literal + '`');
}

function codeblock(event, node) {
  this.out(
    '```' + node.info + this.newline + node.literal + '```');
  this.cr(2);
}

function thematicbreak() {
  this.out(this.options.thematicbreak);
  this.cr(2);
}

function blockquote(event, node, entering) {
  this.inBlockQuote = entering;
}

function list(event, node, entering) {
  if(entering) {
    this.listData = node._listData;
    this.listData.index = 0;
  }else{
    this.cr();
  }
}

function item(event, node, entering) {
  if(entering) {
    this.out(this.listData.type === 'Ordered'
      ? (++this.listData.index) + node.listDelimiter + ' '
      : this.listData.bulletChar + ' ');
  }else{
    this.cr();
  }
}

function htmlblock(event, node) {
  this.out(node.literal);
  this.cr(2);
}

function custominline(event, node, entering) {
  if(entering && node.onEnter) {
    this.out(node.onEnter);
  }else if(!entering && node.onExit) {
    this.out(node.onExit);
  }
}

function customblock(event, node, entering) {
  if(entering && node.onEnter) {
    this.out(node.onEnter);
  }else if(!entering && node.onExit) {
    this.out(node.onExit);
  }
  this.cr(2);
}

/* Helper methods */

function literal(event, node) {
  this.lit(node.literal);
}

function cr(amount) {
  if(amount === undefined) {
    this.lit(this.newline);
  }else{
    this.lit(repeat(this.newline, amount));
  }
}

// quick browser-compatible inheritance
MarkdownRenderer.prototype = new Renderer();

MarkdownRenderer.prototype.text = text;
MarkdownRenderer.prototype.htmlinline = literal;
MarkdownRenderer.prototype.htmlblock = htmlblock;
MarkdownRenderer.prototype.softbreak = softbreak;
MarkdownRenderer.prototype.hardbreak = hardbreak;
MarkdownRenderer.prototype.link = link;
MarkdownRenderer.prototype.image = image;
MarkdownRenderer.prototype.emph = emph;
MarkdownRenderer.prototype.strong = strong;
MarkdownRenderer.prototype.paragraph = paragraph;
MarkdownRenderer.prototype.heading = heading;
MarkdownRenderer.prototype.code = code;
MarkdownRenderer.prototype.codeblock = codeblock;
MarkdownRenderer.prototype.thematicbreak = thematicbreak;
MarkdownRenderer.prototype.blockquote = blockquote;
MarkdownRenderer.prototype.list = list;
MarkdownRenderer.prototype.item = item;
MarkdownRenderer.prototype.custominline = custominline;
MarkdownRenderer.prototype.customblock = customblock;

MarkdownRenderer.prototype.cr = cr;

module.exports = MarkdownRenderer;
