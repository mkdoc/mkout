/**
 *  Manages a list of links and their destinations in a linked list.
 *
 *  The `links` array is a list of nodes and `destinations` maps link 
 *  destinations to their index in the array.
 *
 *  @constructor Links
 */
function Links() {
  this.reset();
}

/**
 *  Add a link node to this collection of links.
 *
 *  @function add
 *  @member Links
 *
 *  @param {Object} node the link node.
 *
 *  @returns a boolean indicating whether the link was added.
 */
function add(node) {
  if(this.destinations[node.destination] === undefined) {
    this.links.push(node);
    this.destinations[node.destination] = this.links.length - 1;
    return true;
  }
  return false;
}

/**
 *  Retrieves a list of link references.
 *
 *  @function list
 *  @member Links
 *
 *  @param {String} [newline] the newline character to use.
 *
 *  @returns list of link references.
 */
function list(newline) {
  var i
    , str = '';
  newline = newline || '\n';
  for(i = 0;i < this.links.length;i++) {
    str += '[' + (i + 1) + ']: ' + this.links[i].destination; 
    str += newline;
  }
  return str;
}

/**
 *  Resets this instance so it does not contain any links.
 *
 *  @function reset
 *  @member Links
 */
function reset() {
  this.links = [];
  this.destinations = {};
}

Object.defineProperty(Links.prototype, 'length', {
  get: function() {
    return this.links.length;
  }
});

Links.prototype.add = add;
Links.prototype.list = list;
Links.prototype.reset = reset;

module.exports = Links;
