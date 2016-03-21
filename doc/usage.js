var out = require('../index')
  , ast = require('mkast');
ast.src('# Heading')
  .pipe(out())
  .pipe(process.stdout);
