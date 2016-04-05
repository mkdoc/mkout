"use strict";

var Renderer = require('./markdown')
  , ast = require('mkast')
  , Node = ast.Node
  , prefix = require('./prefix-lines')
  , Links = require('./links')
  , normalize = require('./normalize')
  , repeat = require('string-repeater')
  , proto = Renderer.prototype;

/**
 *  Renders an abstract syntax tree to a plain text view.
 *
 *  With the exception of the PARAGRAPH, LIST and ITEM node types all 
 *  other markdown formatting is removed.
 *
 *  If you wish to preserve some other aspects of the markdown formatting, you 
 *  can specify options such as:
 *
 *  ```javascript
 *  {preserve:{emph: true}}
 *  ```
 *
 *  Which would preserve emphasis as markdown.
 *
 *  Code blocks (when not preserved) are indented by the whitespace specified 
 *  with the `indent` option, default is four spaces.
 *
 *  Block quotes are indented according to `indent` and then prefixed with a 
 *  vertical pipe (|), you can change this prefix with the `quote` option.
 *
 *  Unless `autolink` is disabled (or links are preserved) links are 
 *  removed and appended to the end of the document such that the input:
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
 *  HTML is normalized to text unless the `html_block` or `html_inline` 
 *  elements are preserved.
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
  this.links = new Links();

  // indentation for code blocks and block quotes
  this.indent = opts.indent || '    ';

  this.quote = opts.quote !== undefined
    ? this.indent + opts.quote : this.indent + '|';

  this.hr = opts.hr || repeat('-', 80);

  // map of node types to preserve as markdown
  this.preserve = opts.preserve || {};
}

function document(node, entering) {
  if(!entering && this.autolink) {
    // print link references by index
    this.out(this.links.list());
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

  if(grandparent && Node.is(grandparent, Node.BLOCK_QUOTE)
    && !this.preserve[Node.BLOCK_QUOTE]) {
    this.out(prefix(node, node.literal, this.quote, true));
  }else if(dest && !this.preserve[Node.LINK]) {
    this.out(node.literal + '[' + (this.links.destinations[dest] + 1) + ']');
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

  // NOTE: it appears that commonmark strips trailing whitespace
  // NOTE: before a soft break
  this.out(' ');
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
  if(entering) {
    this.links.add(node);
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
  this.out(normalize(node.literal));
  this.cr(2);
}

function html_inline(node, entering) {
  if(this.preserve[node.type]) {
    return proto[node.type].call(this, node, entering); 
  }
  this.out(normalize(node.literal));
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
  this.links.reset();
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
