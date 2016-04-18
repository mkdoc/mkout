# Renderers

[![Build Status](https://travis-ci.org/mkdoc/mkout.svg?v=3)](https://travis-ci.org/mkdoc/mkout)
[![npm version](http://img.shields.io/npm/v/mkout.svg?v=3)](https://npmjs.org/package/mkout)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mkout/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mkout?branch=master)

> Render documents to Markdown, Text, HTML, XML, YAML and JSON

Output renderers for [commonmark][].

## 

```
npm i mkout --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

---

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Renderer Implementation](#renderer-implementation)
  - [Markdown](#markdown)
  - [Text](#text)
  - [JSON](#json)
  - [YAML](#yaml)
- [Help](#help)
  - [mkman](#mkman)
  - [mktext](#mktext)
  - [mkhtml](#mkhtml)
- [API](#api)
  - [out](#out)
    - [Options](#options)
  - [JsonRenderer](#jsonrenderer)
    - [Options](#options-1)
  - [Links](#links)
  - [.add](#add)
  - [.list](#list)
  - [.reset](#reset)
  - [ManRenderer](#manrenderer)
    - [Options](#options-2)
  - [MarkdownRenderer](#markdownrenderer)
  - [normalize](#normalize)
  - [TextRenderer](#textrenderer)
    - [Options](#options-3)
  - [YamlRenderer](#yamlrenderer)
    - [Options](#options-4)
- [License](#license)

---

## 

Create the stream and write a [commonmark][] document:

```javascript
var out = require('mkcat')
  , ast = require('mkast');
ast.src('# Heading')
  .pipe(out())
  .pipe(process.stdout);
```

## 

Print as markdown:

```shell
mkcat README.md | mkout
```

Print as HTML:

```shell
mkcat README.md | mkout --html
```

Print as XML:

```shell
mkcat README.md | mkout --xml
```

Print as plain text:

```shell
mkcat README.md | mkout --text
```

YAML is particularly useful to get a compact view of the tree:

```shell
mkcat README.md | mkout -y
```

For more detailed YAML use:

```shell
mkcat README.md | mkout -Y
```

Print as JSON:

```shell
mkcat README.md | mkout -j
```

Pass through the input newline-delimited JSON:

```shell
mkcat README.md | mkout --noop
```

## 

This section briefly describes the handling of the various [commonmark][] types, see the [api docs](#api) for more detail.

### 

The markdown renderer renders all basic markdown types as expected however it is not yet [commonmark][] compliant which is work in progress.

### 

The text renderer inherits from the markdown renderer so you can choose which types to preserve as markdown, by default headings and lists are preserved. Headings are preserved to maintain the document structure but you may disable them; list rendering is always performed using the underlying markdown renderer.

Block and inline HTML is normalized to text but may be preserved.

Links are converted to indexed references in the form `example[1]` and the appropriate references are appended to the document: `[1]:http://example.com`. Duplicate link destinations are resolved.

If you wanted to preserve some inline elements in addition to headings and lists you could pass the options:

```javascript
{preserve:{heading: true, code: true, emph: true, strong: true}}
```

Soft line breaks are removed but you can preserve them. Thematic breaks (`---`) are rendered as a series of 80 hyphens which may be customised.

Code blocks are indented with two spaces, the info string if present is not preserved.

### 

The JSON renderer allows serializing a node tree such that it could be passed between processes or pushed to a remote queue for further processing.

Circular references are resolved and the document has enough information to recreate a node tree with a 1:1 correlation with the original.

### 

The YAML renderer is designed to provide a compact view of the tree which is easy to read but can also include the node properties for an extended view of the document.

Whilst it would be possible to recreate a node tree from a YAML document it is optimized for legibility over processing; use the JSON renderer for serialization requirements.

Compact output for a simple document:

```yaml
---
- document: 
  - paragraph: 
    - text: 'Generated by '
    - link: 
      - text: 'mkdoc'
---
```

## 

```
Usage: mkout [options]

  Render to various output formats.

Options
  -o, --output=[FILE]     Write output to FILE (default: stdout)
  -H, --html              Set output renderer to HTML
  -j, --json              Set output renderer to JSON
  -m, --man               Set output renderer to MAN
  -t, --text              Set output renderer to TEXT
  -x, --xml               Set output renderer to XML
  -y, --yaml              Set output renderer to YAML
  -Y, --yaml-full         Do not compact YAML output
  -n, --noop              Pass through input JSON
  -h, --help              Display help and exit
  --version               Print the version and exit

mkout@1.0.33
```

### 

```
Usage: mkman [options]

  Render to troff man page.

Options
  -t, --title=[VAL]       Set the page title (default: UNTITLED)
  -s, --section=[NUM]     Set the section number (default: 1)
  -i, --inline=[VAL]      Inline code rendering style (default: strong)
  -l, --locale=[VAL]      Locale for automatic date generation (default: en-gb)
  -v, --preamble-version=[VAL]     
                          Version for document preamble (default: 1.0)
  -d, --date=[VAL]        Use specific date
  -h, --help              Display help and exit
  --version               Print the version and exit

mkout@1.0.33
```

### 

```
Usage: mktext [options]

  Render to plain text.

Options
  -i, --indent=[NUM]      Code block and block quote indentation (default: 4)
  -q, --quote=[VAL]       Character used to prefix block quotes
  -e, --emph              Preserve emph as markdown
  -s, --strong            Preserve strong as markdown
  -c, --code              Preserve inline code as markdown
  -l, --link              Preserve links as markdown
  -t, --thematic-break    Preserve thematic break as markdown
  -I, --image             Preserve image as markdown
  -C, --code-block        Preserve code block as markdown
  -B, --block-quote       Preserve block quote as markdown
  -H, --heading           Preserve heading as markdown
  -S, --softbreak         Preserve softbreak as markdown
  -L, --linebreak         Preserve linebreak as markdown
  --html-inline           Preserve inline html as markdown
  --html-block            Preserve html block as markdown
  --custom-inline         Preserve custom inline as markdown
  --custom-block          Preserve custom block as markdown
  -h, --help              Display help and exit
  --version               Print the version and exit

mkout@1.0.33
```

### 

```
Usage: mkhtml [options]

  Render to HTML page.

Options
  -h, --help              Display help and exit
  --version               Print the version and exit

mkout@1.0.33
```

## 

### 

```javascript
out([opts][, cb])
```

Print via a renderer to an output stream.

Returns an output stream.

* `opts` Object processing options.
* `cb` Function callback function.

#### 

* `type` String output type.
* `input` Readable=process.stdin input stream.
* `output` Writable=process.stdout output stream.
* `render` Object renderer options.

### 

```javascript
new JsonRenderer([opts])
```

Renders an abstract syntax tree to JSON.

By default prints a compact JSON document, pass `indent` for indented
output:

```javascript
{indent: 1}
```

But be careful the tree can be very deep so it is not recommended you set
`indent` to greater than two.

* `opts` Object processing options.

#### 

* `indent` Number=0 number of spaces to indent the JSON.

### 

```javascript
new Links()
```

Manages a list of links and their destinations in a linked list.

The `links` array is a list of nodes and `destinations` maps link
destinations to their index in the array.

### 

```javascript
Links.prototype.add(node)
```

Add a link node to this collection of links.

Returns a boolean indicating whether the link was added.

* `node` Object the link node.

### 

```javascript
Links.prototype.list([newline])
```

Retrieves a list of link references.

Returns list of link references.

* `newline` String the newline character to use.

### 

```javascript
Links.prototype.reset()
```

Resets this instance so it does not contain any links.

### 

```javascript
new ManRenderer([opts])
```

Renders an abstract syntax tree to a ROFF man page.

The man page preamble is created using the standard .TH macro and uses
sensible default values when the corresponding preamble options are not
specified.

Adds macros for headings level 1-6 (.h1-.h6), a macro for the thematic
break (.hr) and the newline macro (.nl) after the preamble.

* `opts` Object processing options.

#### 

* `autolink` Boolean=true create automatic links by index.
* `section` String=1 man page section number.
* `title` String=UNTITLED title for the man page.
* `preambleVersion` String=1.0 version for the preamble.
* `description` String description for the preamble.
* `locale` String locale used for date formatting.
* `inline` String=emph|strong formatting for inline code.
* `html` Boolean=false force inclusion of HTML blocks.

### 

```javascript
new MarkdownRenderer([opts])
```

Renders an abstract syntax tree to markdown.

Eventually the aim is to make the output of this renderer fully
[commonmark][] compliant, at the moment it's output has not been
completely tested for compliance.

* `opts` Object processing options.

### 

```javascript
normalize(text)
```

Strips HTML tags from a string and collapses whitespace similar to how
XML text nodes are normalized.

This is designed for the TEXT and MAN output formats so we are not
concerned with XSS attacks, use `striptags` or another library if you
need to strip tags destined for HTML output.

Returns the normalized text.

* `text` String input text.

### 

```javascript
new TextRenderer([opts])
```

Renders an abstract syntax tree to a plain text view.

With the exception of the PARAGRAPH, LIST and ITEM node types all
other markdown formatting is removed.

If you wish to preserve some other aspects of the markdown formatting, you
can specify options such as:

```javascript
{preserve:{emph: true}}
```

Which would preserve emphasis as markdown.

Code blocks (when not preserved) are indented by the whitespace specified
with the `indent` option, default is four spaces.

Block quotes are indented according to `indent` and then prefixed with a
vertical pipe (|), you can change this prefix with the `quote` option.

Unless `autolink` is disabled (or links are preserved) links are
removed and appended to the end of the document such that the input:

```markdown
[Commonmark](http://commonmark.org)
```

Is converted to:

```
Commonmark[1]

[1]: http://commomark.org
```

Soft line breaks are removed unless preserved and a single space is
injected when necessary.

Thematic breaks are rendered as the hyphen (-) repeated 80 times. You may
change this output with the `hr` option.

HTML is normalized to text unless the `html_block` or `html_inline`
elements are preserved.

* `opts` Object processing options.

#### 

* `autolink` Boolean=true create automatic links by index.
* `indent` String amount of whitespace indentation for code blocks.
* `preserve` Object map of node types that should be preserved.

### 

```javascript
new YamlRenderer([opts])
```

Renders an abstract syntax tree to YAML.

This implementation is designed to provide an easy to read view of the
tree; whilst it would certainly be possible to recreate the tree from the
YAML output it has not been optimized for that use case.

By default a compact view of the tree is rendered, if you also want to
inspect the node properties disable `compact`:

```javascript
{compact: false}
```

* `opts` Object processing options.

#### 

* `compact` Boolean=true create compact YAML documents.

## 

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on April 18, 2016

[mkdoc]: https://github.com/mkdoc/mkdoc
[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[commonmark]: http://commonmark.org
[jshint]: http://jshint.com
[jscs]: http://jscs.info

