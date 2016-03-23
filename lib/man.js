"use strict";

var ast = require('mkast')
  , Node = ast.Node
  , Renderer = ast.Renderer
  , manual = require('manual')
  , repeat = require('string-repeater');

/**
 *  Renders an abstract syntax tree to a ROFF man page.
 *
 *  @constructor ManRenderer
 *  @param {Object} [opts] processing options.
 */
function ManRenderer(options) {
  options = options || {};
  Renderer.call(this);

  this.options = options;
  this.newline = options.newline || '.BR\n';
  this.section = options.section || '1';
}

function document(node, entering) {
  if(entering) {
    var preamble = '.TH "' + (this.title || '') + '"';
    preamble += ' "' + this.section + '"';
    preamble += ' "' + new Date().toISOString() + '"';

    //preamble += ' ""';
    //preamble += ' ""';
    this.out(preamble + '\n'); 
  }
}

function text(node) {
  this.lit(manual.sanitize(node.literal));
}

function softbreak() {
  this.out(' ');
  //this.cr();
}

function linebreak() {
  //this.out(this.options.linebreak);
  this.cr();
}

function link(node, entering) {
  //var isRef = node._linkType === 'ref';
  //if(entering) {
    //this.out('[');
  //}else{
    //this.out(']' + (!isRef ? '(' : ': ') + node.destination);
    //if(node.title) {
      //this.out(' "' + node.title + '"'); 
    //}
    //if(!isRef) {
      //this.out(')'); 
    //}else if(isRef && node.next){
      //this.cr(); 
    //}
  //}
}

function image(node, entering) {
  //if(entering) {
    //this.out('![');
  //}else{
    //this.out('](' + node.destination
      //+ (node.title ? ' "' + node.title + '")' : ')'));
  //}
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
      && Node.is(grandparent, Node.LIST)
      && grandparent.listTight) {
        return;
  }
  if(entering) {
    this.out('.PP\n');
  }else if(!entering) {
    this.out('\n');
    this.cr(2);
  }
}

function heading(node, entering) {
  if(entering) {
    if(node.level === 1) {
      this.out('.SH "');
    }else{
      this.out('.SS "');
    }
  }else{
    this.out('"\n');
  }
}

function code(node) {
  this.out('`' + node.literal + '`');
}

function code_block(node, entering) {
  if(entering) {
    this.out('.PP\n.in 10\n');
    //this.out('.PP\n.nf\n.RS\n'); 
    this.out(manual.sanitize(node.literal));
  }else{
    //this.out('.RE\n.fi\n'); 
    this.cr(2);
  }
}

function thematic_break() {
  this.out(this.options.thematicbreak);
  this.cr(2);
}

function block_quote(node, entering) {
  if(entering) {
    this.out('.IN 5\n');
  }else{
    this.out('.IN\n');
    this.cr(2);
  }
}

function list(node, entering) {
  if(!entering) {
    if(node.next && node.next.type === 'list') {
      return;
    }
    this.out('\n');
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
    this.out('\n');
    this.cr();
  }
}

function html_block(node, entering) {
  if(entering) {
    this.out(node.literal);
  }else{
    this.cr(2);
  }
}

function html_inline(node, entering) {
  if(entering) {
    this.lit(node.literal);
  }
}

function custom_inline(node, entering) {
  if(entering && node.onEnter) {
    this.out(node.onEnter);
  }else if(!entering && node.onExit) {
    this.out(node.onExit);
  }
}

function custom_block(node, entering) {
  this.custom_inline(node, entering);
  this.cr(2);
}

/* Helper methods */

function cr(amount) {
  if(amount === undefined) {
    this.lit(this.newline);
  }else if(amount) {
    this.lit(repeat(this.newline, amount));
  }
}

ManRenderer.prototype = Object.create(Renderer.prototype);

ManRenderer.prototype.document = document;
ManRenderer.prototype.text = text;
ManRenderer.prototype.html_inline = html_inline;
ManRenderer.prototype.html_block = html_block;
ManRenderer.prototype.softbreak = softbreak;
ManRenderer.prototype.linebreak = linebreak;
ManRenderer.prototype.link = link;
ManRenderer.prototype.image = image;
ManRenderer.prototype.emph = emph;
ManRenderer.prototype.strong = strong;
ManRenderer.prototype.paragraph = paragraph;
ManRenderer.prototype.heading = heading;
ManRenderer.prototype.code = code;
ManRenderer.prototype.code_block = code_block;
ManRenderer.prototype.thematic_break = thematic_break;
ManRenderer.prototype.block_quote = block_quote;
ManRenderer.prototype.list = list;
ManRenderer.prototype.item = item;
ManRenderer.prototype.custom_inline = custom_inline;
ManRenderer.prototype.custom_block = custom_block;
ManRenderer.prototype.cr = cr;

module.exports = ManRenderer;
