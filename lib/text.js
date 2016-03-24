"use strict";

var Renderer = require('./markdown')
  , ast = require('mkast')
  , Node = ast.Node
  , prefix = require('./prefix-lines')
  , repeat = require('string-repeater')
  , proto = Renderer.prototype;

/**
 *  Renders an abstract syntax tree to a plain text view.
 *
 *  By default this implementation preserves the `heading` type as markdown 
 *  so that the structure of the document is maintained.
 *
 *  With the exception of the PARAGRAPH, LIST and ITEM node types all 
 *  other markdown formatting is removed. For the aforementioned exceptions 
 *  setting a `preserve` option will have no effect as they are always 
 *  preserved according to the rules for markdown rendering.
 *
 *  If you wish to preserve some other aspects of the markdown formatting, you 
 *  can specify options such as:
 *
 *  ```javascript
 *  {preserve:{heading: true, emph: true}}
 *  ```
 *
 *  Which would preserve emphasis in addition to the default formatting that 
 *  is preserved. If you don't want to preserve any markdown formatting pass 
 *  the empty object:
 *
 *  ```javascript
 *  {preserve: {}}
 *  ```
 *
 *  Code blocks (when not preserved) are indented by the whitespace specified 
 *  with the `indent` option, default is two spaces.
 *
 *  Block quotes are indented according to `indent` and then prefixed with a 
 *  vertical pipe (|), you can change this prefix with the `blockquote` option.
 *
 *  Unless `autolink` is disabled links are removed and appended to the end 
 *  of the document such that the input:
 *
 *  ```markdown
 *  [Commonmark](http://commonmark.org)
 *  ```
 *
 *  Is converted to:
 *
 *  ```
 *  Commonmark[1]
 *
 *  [1]: http://commomark.org
 *  ```
 *
 *  Soft line breaks are removed unless preserved and a single space is 
 *  injected when necessary.
 *
 *  Thematic breaks are rendered as the hyphen (-) repeated 80 times. You may 
 *  change this output with the `hr` option.
 *
 *  @constructor TextRenderer
 *  @param {Object} [opts] processing options.
 *
 *  @option {Boolean=true} [autolink] create automatic links by index.
 *  @option {String} [indent] amount of whitespace indentation for code blocks.
 *  @option {Object} [preserve] map of node types that should be preserved.
 */
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

  this.blockquote = opts.blockquote || this.indent + '|';

  this.hr = opts.hr || repeat('-', 80);

  // map of node types to preserve as markdown
  this.preserve = opts.preserve || {heading: true};
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
    , grandparent = p ? p.parent : null
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

  if(Node.is(grandparent, Node.BLOCK_QUOTE)
    && !this.preserve[Node.BLOCK_QUOTE]) {
    this.out(prefix(node, node.literal, this.blockquote, true));
  }else if(dest && !this.preserve[Node.LINK]) {
    this.out(node.literal + '[' + (this.destinations[dest] + 1) + ']');
  }else{
    this.out(node.literal);
  }
}

function softbreak(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  // preserve soft line breaks in block quotes
  if(node.parent && node.parent.parent
    && Node.is(node.parent.parent, Node.BLOCK_QUOTE)) {
    this.cr();
    return; 
  }

  // output single space for soft line breaks unless preserved
  if(node.prev && Node.is(node.prev, Node.TEXT)) {
    if(!/ $/.test(node.prev.literal)) {
      this.out(' '); 
    } 
  }
}

function linebreak(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  this.cr();
}

function link(node, entering) {
  if(!this.autolink || this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  // track links in the document, so that they can be printed
  // when the document is closed and so that the `text` handling
  // can append a link index to the literal in the form: link[1]
  if(entering && this.destinations[node.destination] === undefined) {
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
  this.cr();
}

function thematic_break(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }

  this.out(this.hr);
  this.cr(2);
}

function block_quote(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function html_block(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function html_inline(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function custom_inline(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function custom_block(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
}

function render() {
  // reset so renderer is re-usable
  this.links = [];
  this.destinations = {};
  return Renderer.prototype.render.apply(this, arguments);
}

TextRenderer.prototype = Object.create(proto);

TextRenderer.prototype.render = render;

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
TextRenderer.prototype.heading = heading;
TextRenderer.prototype.code = code;
TextRenderer.prototype.code_block = code_block;
TextRenderer.prototype.thematic_break = thematic_break;
TextRenderer.prototype.block_quote = block_quote;
TextRenderer.prototype.custom_inline = custom_inline;
TextRenderer.prototype.custom_block = custom_block;

module.exports = TextRenderer;
