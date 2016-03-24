var mk = require('mktask');

// @task api build the api docs.
function api(cb) {
  mk.api(
    [
      'index.js',
      'lib/json.js',
      'lib/man.js',
      'lib/markdown.js',
      'lib/text.js',
      'lib/yaml.js'
    ],
    {
      stream: mk.dest('API.md'),
      heading: 'API'
    }, cb);
}

// @task readme build the readme file.
function readme(cb) {
  mk.doc('doc/readme.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.out())
    .pipe(mk.dest('README.md'))
    .on('finish', cb);
}

// @task bug build the bug file.
function bug(cb) {
  mk.doc('exec-bug.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.out())
    .pipe(mk.dest('BUG.md'))
    .on('finish', cb);
}


mk.task(bug);
mk.task(api);
mk.task(readme);
