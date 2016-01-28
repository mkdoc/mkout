var Renderer = require('./renderer')
  , repeat = require('../repeat');

function MarkdownRenderer(options) {
  options = options || {};

  var newline = options.newline || '\n';

  this.text = function text(event, node) {
    return node.literal;
  }

  this.softbreak = function softbreak() {
    return newline;
  }

  this.hardbreak = function hardbreak() {
    // TODO: allow backslash style escape option
    return '  ' + newline;
  }

  this.emph = function emph() {
    return '*';
  }

  this.paragraph = function paragraph(event, node, enter) {
    var grandparent = node.parent.parent;
    if(grandparent !== null &&
        grandparent.type === 'List') {
        if (grandparent.listTight) {
            return;
        }
    }
    if(!enter) {
      return newline + newline;
    }
  }

  this.heading = function heading(event, node, enter) {
    return enter ? (repeat('#', node.level) + ' ') : newline + newline;
  }

  this.codeblock = function codeblock(event, node) {
    return '```' + node.info + newline + node.literal + '```' + newline;
  }

}

// quick browser-compatible inheritance
MarkdownRenderer.prototype = new Renderer();

module.exports = MarkdownRenderer;
