function prefix(node, val, indent) {
  var lines = val.split('\n')
    , out = '';

  lines.forEach(function(line, index) {

    // empty last line
    if(!line && index === lines.length - 1 && node.lastLineBlank) {
      return; 
    }

    if(line) {
      out += indent + line;
    }
    if(index < lines.length - 1) {
      out += '\n';
    }
  })

  return out;
}

module.exports = prefix;
