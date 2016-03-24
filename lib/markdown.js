"use strict";

var ast = require('mkast')
  , Node = ast.Node
  , Renderer = ast.Renderer
  , repeat = require('string-repeater');

/**
 *  Renders an abstract syntax tree to markdown.
 *
 *  Eventually the aim is to make the output of this renderer fully 
 *  [commonmark][] compliant, at the moment it's output has not been 
 *  completely tested for compliance.
 *
 *  @constructor MarkdownRenderer
 *  @param {Object} [opts] processing options.
 */
function MarkdownRenderer(options) {
  options = options || {};

  Renderer.call(this);

  // set to two spaces ('  ') for the alternative style hard line break
  options.linebreak = options.linebreak || '\\';

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

function text(node) {
  this.lit(node.literal);
}

function softbreak() {
  this.cr();
}

function linebreak() {
  this.out(this.options.linebreak);
  this.cr();
}

function link(node, entering) {
  var isRef = node._linkType === 'ref';
  if(entering) {
    this.out('[');
  }else{
    this.out(']' + (!isRef ? '(' : ': ') + node.destination);
    if(node.title) {
      this.out(' "' + node.title + '"'); 
    }
    if(!isRef) {
      this.out(')'); 
    }else if(isRef && node.next){
      this.cr(); 
    }
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

  // let lists handle their own line breaks
  var grandparent = node.parent ? node.parent.parent : null;
  if(grandparent
      && Node.is(grandparent, Node.LIST)) {
      return;
  }

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
    this.cr(); 
  }
}

function item(node, entering) {
  var p = node.parent
    , parents = []
    , current
    , padding = 0
    , indent;

  while(p) {
    if(Node.is(p, Node.LIST)) {
      parents.push(p);
    }
    p = p.parent; 
  }

  // the list we are in
  current = parents.pop();

  parents.forEach(function(list) {
    padding += list._listData.padding;
  })

  if(padding) {
    padding++;
  }

  indent = repeat(' ', padding);

  if(entering) {

    if(parents.length) {
      this.cr(); 
    }

    if(padding) {
      this.out(indent);
    }

    this.out(node._listData.type === 'ordered'
      ? (node._listData.start) + node._listData.delimiter + ' '
      : node._listData.bulletChar + ' ');
  }else{
    if(!parents.length) {
      this.cr();
    }
    //console.error(node.next.type);
    //if(!parents.length
        //&& !node.next
        //|| (node.next && !Node.is(node.next, Node.LIST))) {
      //this.cr(); 
    //}
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
  if(entering && node.onEnter) {
    this.out(node.onEnter);
  }else if(!entering && node.onExit) {
    this.out(node.onExit);
  }

  if(!entering && (node.onEnter || node.onExit)) {
    this.cr(2);
  }
}

/* Helper methods */

function cr(amount) {
  if(amount === undefined) {
    this.lit(this.newline);
  }else if(amount) {
    this.lit(repeat(this.newline, amount));
  }
}

MarkdownRenderer.prototype = Object.create(Renderer.prototype);

MarkdownRenderer.prototype.text = text;
MarkdownRenderer.prototype.html_inline = html_inline;
MarkdownRenderer.prototype.html_block = html_block;
MarkdownRenderer.prototype.softbreak = softbreak;
MarkdownRenderer.prototype.linebreak = linebreak;
MarkdownRenderer.prototype.link = link;
MarkdownRenderer.prototype.image = image;
MarkdownRenderer.prototype.emph = emph;
MarkdownRenderer.prototype.strong = strong;
MarkdownRenderer.prototype.paragraph = paragraph;
MarkdownRenderer.prototype.heading = heading;
MarkdownRenderer.prototype.code = code;
MarkdownRenderer.prototype.code_block = code_block;
MarkdownRenderer.prototype.thematic_break = thematic_break;
MarkdownRenderer.prototype.block_quote = block_quote;
MarkdownRenderer.prototype.list = list;
MarkdownRenderer.prototype.item = item;
MarkdownRenderer.prototype.custom_inline = custom_inline;
MarkdownRenderer.prototype.custom_block = custom_block;
MarkdownRenderer.prototype.cr = cr;

module.exports = MarkdownRenderer;
