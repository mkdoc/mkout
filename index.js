var deserialize = require('mkast').deserialize
  , Node = require('mkast').Node
  , through = require('through3')
  , types = {
      markdown: './lib/render/markdown',
      yaml: './lib/render/yaml',
      xml: 'commonmark/lib/xml',
      html: 'commonmark/lib/render/html'
    };

function Render(opts) {
  opts = opts || {};
  this.renderer = opts.renderer;
}

function render(chunk, encoding, cb) {
  if(!Node.is(chunk, Node.EOF)) {
    this.push(this.renderer.render(chunk));
  }
  cb();
}

var RenderStream = through.transform(render, {ctor: Render});

/**
 *  Print via a renderer to an output stream.
 *
 *  @function out
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @option {String} [type] output type.
 *  @option {Readable=process.stdin} [input] input stream.
 *  @option {Writable=process.stdout} [output] output stream.
 *  @option {Object} [render] renderer options.
 *
 *  @returns an output stream.
 */
function out(opts, cb) {
  opts = opts || {};
  opts.input = opts.input;
  opts.output = opts.output;
  opts.type = opts.type || 'markdown';
  opts.render = opts.render || {};

  if(opts.type === 'json') {
    opts.input.pipe(opts.output);
    return opts.output; 
  }

  if(!types[opts.type]) {
    return cb(new Error('unknown output type: ' + opts.type)); 
  }

  var Type = require(types[opts.type])
    , renderer = new Type(opts.render)
    , deserializer
    , render = new RenderStream({renderer: renderer});

  deserializer = deserialize(opts.input);

  if(opts.cli !== true) {
    return render;
  }

  // handle output stream
  if(opts.output) {
    render.pipe(opts.output); 
  }

  function writer(doc) {
    opts.output.write(renderer.render(doc));
  }

  deserializer
    .on('eof', writer)
    .on('fragment', writer);

  if(cb) {
    opts.output
      .once('error', cb)
      .once('finish', cb);
  }

  return opts.output;
}

// supported renderer types
out.types = types;

module.exports = out;
