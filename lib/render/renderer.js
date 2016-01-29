"use strict";

var Types = [
  'document',
  'text',
  'softbreak',
  'hardbreak',
  'emph',
  'strong',
  'htmlinline',
  'custominline',
  'link',
  'image',
  'code',
  'paragraph',
  'blockquote',
  'item',
  'list',
  'heading',
  'codeblock',
  'htmlblock',
  'customblock',
  'thematicbreak'
];

function Renderer() {}

function render(block) {
  var walker = block.walker()
    , event
    , type
    , ret
    , buf = '';
  while((event = walker.next())) {
    type = event.node.type.toLowerCase();
    if(typeof this[type] === 'function') {
      ret = this[type](event, event.node, event.entering);
      if(ret !== undefined) {
        buf += ret; 
      }
    }else{
      throw new Error('Unknown node type ' + event.node.type);
    }
  }
  return buf;
}

Renderer.prototype.render = render;

Types.forEach(function(type) {
  Renderer.prototype[type] = function(/* event, node, entering */) {}
})

module.exports = Renderer;
