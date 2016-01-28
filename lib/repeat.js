/**
 *  Repeat a string.
 *
 *  @param str The string to repeat.
 *  @param len The number of times to repeat.
 */
function repeat(str, len) {
  len = Math.abs(len);
  return new Array(len + 1).join(str);
}

module.exports = repeat;
