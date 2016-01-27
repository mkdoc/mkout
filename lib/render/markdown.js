"use strict";

/**
 *  Repeat a string.
 *
 *  @param len The number of times to repeat.
 *  @param str The string to repeat, default is a space.
 */
function repeat(str, len) {
  len = typeof len !== 'number' ? 2 : len;
  len = Math.abs(len);
  return new Array(len + 1).join(str || ' ');
}

// Helper function to produce an HTML tag.
var tag = function(name, attrs, selfclosing) {
    var result = '<' + name;
    if (attrs && attrs.length > 0) {
        var i = 0;
        var attrib;
        while ((attrib = attrs[i]) !== undefined) {
            result += ' ' + attrib[0] + '="' + attrib[1] + '"';
            i++;
        }
    }
    if (selfclosing) {
        result += ' /';
    }

    result += '>';
    return result;
};

//var reHtmlTag = /\<[^>]*\>/;
//var reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
//var reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

var renderNodes = function(block) {

  var inBlockQuote = false;
    var attrs;
    var info_words;
    var tagname;
    var walker = block.walker();
    var event, node, entering;
    var buffer = "";
    //var lastOut = "\n";
    var disableTags = 1;
    //var grandparent;
    var out = function(s) {
      buffer += s;
      //lastOut = s;
    };
    var cr = function() {
      buffer += '\n';
    };

    var options = this.options;

    if (options.time) { console.time("rendering"); }

    while ((event = walker.next())) {
        entering = event.entering;
        node = event.node;

        attrs = [];
        if (options.sourcepos) {
            var pos = node.sourcepos;
            if (pos) {
                attrs.push(['data-sourcepos', String(pos[0][0]) + ':' +
                            String(pos[0][1]) + '-' + String(pos[1][0]) + ':' +
                            String(pos[1][1])]);
            }
        }

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
            out(this.softbreak);
            cr();
            break;

        case 'Emph':
            out(options.underscore ? '_' : '*');
            break;

        case 'Strong':
            out('**');
            break;

        case 'HtmlInline':
            if (options.safe) {
                out('<!-- raw HTML omitted -->');
            } else {
                out(node.literal);
            }
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
                    attrs.push(['href', node.destination]);
                if (node.title) {
                    attrs.push(['title', node.title]);
                }
                out(tag('a', attrs));
            } else {
                out(tag('/a'));
            }
            break;

        case 'Image':
            if (entering) {
                if (disableTags === 0) {
                    out('<img src="' + node.destination +
                        '" alt="');
                }
                disableTags += 1;
            } else {
                disableTags -= 1;
                if (disableTags === 0) {
                    if (node.title) {
                        out('" title="' + node.title);
                    }
                    out('" />');
                }
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
            if (entering) {
                out('* ');
            } else {
                //out(tag('/li'));
                //cr();
            }
            break;

        case 'List':
            tagname = node.listType === 'Bullet' ? 'ul' : 'ol';
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
            info_words = node.info ? node.info.split(/\s+/) : [];
            cr();
            out('```' + info_words.join(' ') + '\n');
            out(node.literal);
            out('```');
            cr();
            cr();
            break;

        case 'HtmlBlock':
            cr();
            if (options.safe) {
                out('<!-- raw HTML omitted -->');
            } else {
                out(node.literal);
            }
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
            cr();
            out(tag('hr', attrs, true));
            cr();
            break;

        default:
            throw "Unknown node type " + node.type;
        }

    }
    if (options.time) { console.timeEnd("rendering"); }
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
