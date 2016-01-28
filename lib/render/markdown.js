var Renderer = require('./renderer')
  , repeat = require('../repeat');

function MarkdownRenderer(options) {
  options = options || {};

  var newline = options.newline || '\n';
  
  function literal(event, node) {
    return node.literal; 
  }

  this.text = literal; 
  this.htmlinline = literal; 

  this.softbreak = function softbreak() {
    return newline;
  }

  this.link = function link(event, node, entering) {
    if(entering) {
      return '[';
    }else{
      return '](' + node.destination
        + (node.title ? ' "' + node.title + '")' : ')');
    }
  }

  this.hardbreak = function hardbreak() {
    // TODO: allow backslash style escape option
    return '  ' + newline;
  }

  this.emph = function emph() {
    return '*';
  }

  this.strong = function strong() {
    return '**';
  }

  this.paragraph = function paragraph(event, node, entering) {
    var grandparent = node.parent.parent;
    if(grandparent !== null &&
        grandparent.type === 'List') {
        if (grandparent.listTight) {
            return;
        }
    }
    if(!entering) {
      return newline + newline;
    }
  }

  this.heading = function heading(event, node, entering) {
    return entering ? (repeat('#', node.level) + ' ') : newline + newline;
  }

  this.codeblock = function codeblock(event, node) {
    return '```' + node.info + newline + node.literal + '```' + newline;
  }

}

// quick browser-compatible inheritance
MarkdownRenderer.prototype = new Renderer();

module.exports = MarkdownRenderer;
