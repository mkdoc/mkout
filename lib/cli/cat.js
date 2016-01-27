var Reader = require('../cat')
  , parser = require('cli-argparse')
  , fs = require('fs')
  , util = require('util');

/**
 *  Process the command line arguments and print files.
 */
function cli(args) {
  var reader = new Reader()
    , argv = parser(args)
    , Type;

  if(!args || !args.length) {
    return new Error('no arguments specified');
  }

  var i
    , file
    , stat
    , stats = {}
    , files = [];

  for(i = 0;i < argv.unparsed.length;i++) {
    file = argv.unparsed[i];
    try {
      stat = fs.statSync(file);
      if(stat.isDirectory()) {
        return new Error(
          util.format('file %s is a directory', file)); 
      }
      stats[file] = stat;
    }catch(e) {
      return e;
    }
    files.push(file);
  }

  if(argv.flags.json) {
    Type = require('../json');
  }else if(argv.flags.html) {
    Type = require('../html');
  }else if(argv.flags.xml) {
    Type = require('../xml');
  }
  
  reader.pipe(new Type()).pipe(process.stdout);
  reader.end(files);
}

module.exports = cli;
