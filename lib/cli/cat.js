var Reader = require('../cat')
  , Stringify = require('../stringify')
  , Html = require('../html')
  , parser = require('cli-argparse')
  , fs = require('fs')
  , util = require('util');

/**
 *  Process the command line arguments and print files.
 */
function cli(args) {
  var reader = new Reader()
    , argv = parser(args);
  if(!args || !args.length) {
    return new Error('no arguments specified');
  }

  //console.dir(argv);

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
    reader.pipe(new Stringify()).pipe(process.stdout);
  }else if(argv.flags.html) {
    reader.pipe(new Html()).pipe(process.stdout);
  }
  
  reader.end(files);
}

module.exports = cli;
