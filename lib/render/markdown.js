"use strict";

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

  var inBlockQuote = false;
  var attrs;
  var walker = block.walker();
  var event, node, entering;
  var buffer = "";
  //var grandparent;
  var out = function(s) {
    buffer += s;
  };
  var cr = function() {
    buffer += '\n';
  };

  //var options = this.options;

    while ((event = walker.next())) {
        entering = event.entering;
        node = event.node;

        attrs = [];
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
            //console.dir('Hardbreak');
            // NOTE: can also use two spaces: '  '
            out('  ' + this.softbreak);
            cr();
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
        case 'CustomInline':
            if (entering && node.onEnter) {
                out(node.onEnter);
            } else if (!entering && node.onExit) {
                out(node.onExit);
            }
            break;
        case 'Link':
            if (entering) {
                out('[');
            } else {
                out('](' + node.destination
                  + (node.title ? ' "' + node.title + '")' : ')'));
            }
            break;
        case 'Image':
            if (entering) {
                //if (disableTags === 0) {
                    //out('<img src="' + node.destination +
                        //'" alt="');
                //}
                //disableTags += 1;
            } else {
                //disableTags -= 1;
                //if (disableTags === 0) {
                    //if (node.title) {
                        //out('" title="' + node.title);
                    //}
                    //out('" />');
                //}
            }
            break;
        case 'Code':
            out('`' + node.literal + '`');
            break;
        case 'Document':
            break;
        case 'Paragraph':
            //grandparent = node.parent.parent;
            //if (grandparent !== null &&
                //grandparent.type === 'List') {
                //if (grandparent.listTight) {
                    //break;
                //}
            //}
            if (entering) {
                //cr();
            } else {
                cr();
            }
            break;
        case 'BlockQuote':
            if (entering) {
                inBlockQuote = true;
            } else {
                inBlockQuote = false;
                cr();
            }
            break;
        case 'Item':
            if(entering) {
                out('* ');
            }
            break;
        case 'List':
            //tagname = node.listType === 'Bullet' ? 'ul' : 'ol';
            if (entering) {
                //var start = node.listStart;
                //if (start !== null && start !== 1) {
                    //attrs.push(['start', start.toString()]);
                //}
            } else {
                cr();
                //out(tag('/' + tagname));
                //cr();
            }
            break;

        case 'Heading':
            if(entering) {
              out(repeat('#', node.level) + ' ');
            } else {
              cr();
              cr();
            }
            break;
        case 'CodeBlock':
            out('```' + node.info + '\n');
            out(node.literal);
            out('```');
            cr();
            cr();
            break;
        case 'HtmlBlock':
            out(node.literal);
            cr();
            break;
        case 'CustomBlock':
            cr();
            if (entering && node.onEnter) {
                out(node.onEnter);
            } else if (!entering && node.onExit) {
                out(node.onExit);
            }
            cr();
            break;

        case 'ThematicBreak':
            out('---');
            cr();
            break;

        default:
            throw "Unknown node type " + node.type;
        }

    }

    return buffer;
};

function MarkdownRenderer(options){
  return {
    // default options:
    softbreak: '\n',
    options: options || {},
    render: renderNodes
  };
}

module.exports = MarkdownRenderer;
