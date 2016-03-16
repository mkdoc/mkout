"use strict";

var Renderer = require('commonmark/lib/render/renderer')
  , repeat = require('string-repeater');

function MarkdownRenderer(options) {
  options = options || {};

  Renderer.call(this, options.stream);

  // set to two spaces ('  ') for the alternative style hard line break
  options.hardbreak = options.hardbreak || '\\';

  // set to underscore for the emphasis variant
  options.emph = options.emph || '*';

  // set to two underscores for the strong variant
  options.strong = options.strong || '**';

  // set to asterisks ('***') or an alternative
  options.thematicbreak = options.thematicbreak || '---';

  // set to enable or disable setext heading styles (levels 1 & 2)
  options.setext = options.setext !== undefined ? options.setext : false;

  this.options = options;
  this.newline = options.newline || '\n';
}

/* Node methods */

function document(node, entering) {

  if(!entering && node.refs) {
    var i, ref;
    for(i = 0;i < node.refs.length;i++) {
      ref = node.refs[i]._link;
      this.out('[' + ref.label + ']');
      if(ref.title) {
        this.out('(' + ref.title + ')');
      }
      this.out(': ' + ref.destination);
      this.cr();
    }
  }
}

function text(node) {
  this.lit(node.literal);
}

function softbreak() {
  this.cr();
}

function hardbreak() {
  this.out(this.options.hardbreak);
  this.cr();
}

function link(node, entering) {
  if(entering) {
    this.out('[');
  }else{
    this.out('](' + node.destination
      + (node.title ? ' "' + node.title + '")' : ')'));
  }
}

function image(node, entering) {
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

function paragraph(node, entering) {
  var ancestor = node.parent;
  while(ancestor) {
    if(ancestor.type === 'list' && ancestor.listTight) {
      return; 
    }
    ancestor = ancestor.parent; 
  }
  //if(grandparent !== null &&
      //grandparent.type === 'list') {
      //if(grandparent.listTight) {
        //return;
      //}
  //}

  if(!entering) {
    this.cr(2);
  }
}

function heading(node, entering) {
  var setext = this.options.setext
        && (node.level === 1 || node.level === 2)
    , amount;
  if(entering && !setext) {
    this.out(repeat('#', node.level) + ' ');
  }else if(!entering) {
    if(setext) {
      amount = 1;
      this.cr();
      this.out(repeat(node.level === 1 ? '=' : '-', amount));
    }
    this.cr(2);
  }
}

function code(node) {
  this.out('`' + node.literal + '`');
}

function codeblock(node) {
  this.out(
    '```' + node.info + this.newline + node.literal + '```');
  this.cr(2);
}

function thematicbreak() {
  this.out(this.options.thematicbreak);
  this.cr(2);
}

function blockquote(node, entering) {
  if(entering) {
    this.out('> '); 
  }
}

function list(node, entering) {
  if(entering) {
    this.listData = node._listData;
    console.error('%j', this.listData);
  }else{
    this.cr();
  }
}

function item(node, entering) {
  if(entering) {

    if(this.listData.markerOffset) {
      this.out(repeat(' ', this.listData.markerOffset)); 
    }

    this.out(this.listData.type === 'ordered'
      ? (node._listData.start) + this.listData.delimiter + ' '
      : this.listData.bulletChar + ' ');
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

function cr(amount) {
  if(amount === undefined) {
    this.lit(this.newline);
  }else if(amount) {
    this.lit(repeat(this.newline, amount));
  }
}

MarkdownRenderer.prototype = Object.create(Renderer.prototype);

MarkdownRenderer.prototype.document = document;

MarkdownRenderer.prototype.text = text;
MarkdownRenderer.prototype.html_inline = literal;
MarkdownRenderer.prototype.html_block = html_block;
MarkdownRenderer.prototype.softbreak = softbreak;
MarkdownRenderer.prototype.linebreak = hardbreak;
MarkdownRenderer.prototype.link = link;
MarkdownRenderer.prototype.image = image;
MarkdownRenderer.prototype.emph = emph;
MarkdownRenderer.prototype.strong = strong;
MarkdownRenderer.prototype.paragraph = paragraph;
MarkdownRenderer.prototype.heading = heading;
MarkdownRenderer.prototype.code = code;
MarkdownRenderer.prototype.code_block = codeblock;
MarkdownRenderer.prototype.thematic_break = thematicbreak;
MarkdownRenderer.prototype.block_quote = blockquote;
MarkdownRenderer.prototype.list = list;
MarkdownRenderer.prototype.item = item;
MarkdownRenderer.prototype.custom_inline = custom_inline;
MarkdownRenderer.prototype.custom_block = custom_block;
MarkdownRenderer.prototype.cr = cr;

module.exports = MarkdownRenderer;
