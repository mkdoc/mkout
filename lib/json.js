"use strict";

var ast = require('mkast')
  , Renderer = ast.Renderer
  , Node = ast.Node;

/**
 *  Renders an abstract syntax tree to JSON.
 *
 *  By default prints a compact JSON document, pass `indent` for indented 
 *  output:
 *
 *  ```javascript
 *  {indent: 1}
 *  ```
 *
 *  But be careful the tree can be very deep so it is not recommended you set 
 *  `indent` to greater than two.
 *
 *  @constructor JsonRenderer
 *  @param {Object} [opts] processing options.
 *
 *  @option {Number=0} [indent] number of spaces to indent the JSON.
 */
function JsonRendererer(opts) {
  opts = opts || {};
  Renderer.call(this);
  this.indent = typeof(opts.indent) === 'number' && opts.indent >= 0
    ? opts.indent : 0;
}

function render(ast) {
  return JSON.stringify(Node.serialize(ast), undefined, this.indent);
}

JsonRendererer.prototype = Object.create(Renderer.prototype);

JsonRendererer.prototype.render = render;

module.exports = JsonRendererer;
