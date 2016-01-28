var CatReader = require('../cat')
  , parser = require('cli-argparse')
  , commonmark = require('commonmark')
  , fs = require('fs')
  , util = require('util');

/**
 *  Process the command line arguments and print files.
 */
function cli(args) {
  var reader = new CatReader()
    , argv = parser(args)
    , Type;

  if(argv.flags.json) {
    Type = require('../json');
  }else if(argv.flags.html) {
    Type = require('../html');
  }else if(argv.flags.xml) {
    Type = require('../xml');
  }else{
    Type = require('../markdown');
  }

  if(!args || !args.length) {
    var buf = new Buffer(0);
    process.stdin.on('readable', function onReadable() {
      var data = process.stdin.read();
      if(data === null && buf.length === 0) {
        throw new Error('input expected on stdin'); 
      }else if(data) {
        buf = Buffer.concat([buf, data], buf.length + data.length);
      } 
    })
    process.stdin.on('end', function onEnd() {
      reader = new Type();
      var writer = new commonmark.Parser();
      reader.pipe(process.stdout);
      reader.end(writer.parse('' + buf));
    })
  }else{

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

    reader.pipe(new Type()).pipe(process.stdout);
    reader.end(files);
  }
}

module.exports = cli;
