"use strict";

//var dump = require('../dump');

/**
 *  Repeat a string.
 *
 *  @param str The string to repeat.
 *  @param len The number of times to repeat.
 */
function repeat(str, len) {
  len = Math.abs(len);
  return new Array(len + 1).join(str);
}

var renderNodes = function renderNodes(block) {

  var walker = block.walker()
    , inBlockQuote = false
    , listData
    , event
    , node
    , entering
    , buffer = ""
    , options = this.options
    , grandparent
    , newline = options.newline || '\n';

  
  function out(s) {
    buffer += s;
  }

  function cr(len) {
    if(len === undefined) {
      buffer += newline;
    }else{
      buffer += repeat(newline, len);
    }
  }

  while((event = walker.next())) {
    entering = event.entering;
    node = event.node;

    //console.log(node.type);

    switch (node.type) {
      case 'Text':
        if(inBlockQuote) {
          out('> ' + node.literal);
        }else{
          out(node.literal);
        }
        break;
      case 'Softbreak':
        out(this.softbreak);
        break;
      case 'Hardbreak':
        out('  ' + this.softbreak);
        break;
      case 'Emph':
        out('*');
        break;
      case 'Strong':
        out('**');
        break;
      case 'HtmlInline':
        out(node.literal);
        break;
      //case 'CustomInline':
        //if(entering && node.onEnter) {
          //out(node.onEnter);
        //}else if(!entering && node.onExit) {
          //out(node.onExit);
        //}
        //break;
      case 'Link':
        if(entering) {
          out('[');
        }else{
          out('](' + node.destination
            + (node.title ? ' "' + node.title + '")' : ')'));
        }
        break;
      case 'Image':
        if(entering) {
          out('![');
        }else{
          out('](' + node.destination
            + (node.title ? ' "' + node.title + '")' : ')'));
        }
        break;
      case 'Code':
        out('`' + node.literal + '`');
        break;
      case 'Document':
        break;
      case 'Paragraph':
        grandparent = node.parent.parent;
        if(grandparent !== null &&
            grandparent.type === 'List') {
            if (grandparent.listTight) {
                break;
            }
        }
        if(!entering) {
          cr(2);
        }
        break;
      case 'BlockQuote':
        if(entering) {
          inBlockQuote = true;
        }else{
          inBlockQuote = false;
          cr();
        }
        break;
      case 'Item':
        if(entering) {
          out(listData.type === 'Ordered'
            ? (++listData.index) + node.listDelimiter + ' '
            : listData.bulletChar + ' ');
        }else{
          cr();
        }
        break;
      case 'List':
        if(entering) {
          listData = node._listData;
          listData.index = 0;
        }else{
          cr();
        }
        break;
      case 'Heading':
        if(entering) {
          out(repeat('#', node.level) + ' ');
        }else{
          cr(2);
        }
        break;
      case 'CodeBlock':
        out('```' + node.info + '\n');
        out(node.literal);
        out('```\n');
        cr();
        break;
      case 'HtmlBlock':
        out(node.literal);
        cr();
        break;
      //case 'CustomBlock':
        //cr();
        //if(entering && node.onEnter) {
          //out(node.onEnter);
        //}else if(!entering && node.onExit) {
          //out(node.onExit);
        //}
        //cr();
        //break;
      case 'ThematicBreak':
        out('---');
        cr();
        break;
      default:
        throw new Error("Unknown node type " + node.type);
    }
  }
  return buffer;
};

function MarkdownRenderer(options){
  return {
    softbreak: '\n',
    options: options || {},
    render: renderNodes
  };
}

module.exports = MarkdownRenderer;
