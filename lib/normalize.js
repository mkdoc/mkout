/**
 *  Strips HTML tags from a string and collapses whitespace similar to how 
 *  XML text nodes are normalized.
 *
 *  This is designed for the TEXT and MAN output formats so we are not 
 *  concerned with XSS attacks, use `striptags` or another library if you 
 *  need to strip tags destined for HTML output.
 *
 *  @function normalize
 *  @param {String} text input text.
 *
 *  @returns the normalized text.
 */
function normalize(text) {
  // strip the tags
  text = text.replace(/(<([^>]+)>)/ig,'');
  // no newlines or tabs
  text = text.replace(/[\n\t]+/g, '');
  // collapse multiple spaces
  return text.replace(/ +/g, ' ');
}

module.exports = normalize;
