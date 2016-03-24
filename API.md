# API

## out

```javascript
out([opts][, cb])
```

Print via a renderer to an output stream.

Returns an output stream.

* `opts` Object processing options.
* `cb` Function callback function.

### Options

* `type` String output type.
* `input` Readable=process.stdin input stream.
* `output` Writable=process.stdout output stream.
* `render` Object renderer options.

## JsonRenderer

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

### Options

* `indent` Number=0 number of spaces to indent the JSON.

## ManRenderer

```javascript
new ManRenderer([opts])
```

Renders an abstract syntax tree to a ROFF man page.

* `opts` Object processing options.

## MarkdownRenderer

```javascript
new MarkdownRenderer([opts])
```

Renders an abstract syntax tree to markdown.

Eventually the aim is to make the output of this renderer fully
[commonmark][] compliant, at the moment it's output has not been
completely tested for compliance.

* `opts` Object processing options.

## TextRenderer

```javascript
new TextRenderer([opts])
```

Renders an abstract syntax tree to a plain text view.

By default this implementation preserves the `heading` type as markdown
so that the structure of the document is maintained.

With the exception of the PARAGRAPH, LIST and ITEM node types all
other markdown formatting is removed. For the aforementioned exceptions
setting a `preserve` option will have no effect as they are always
preserved according to the rules for markdown rendering.

If you wish to preserve some other aspects of the markdown formatting, you
can specify options such as:

```javascript
{preserve:{heading: true, emph: true}}
```

Which would preserve emphasis in addition to the default formatting that
is preserved. If you don't want to preserve any markdown formatting pass
the empty object:

```javascript
{preserve: {}}
```

Code blocks (when not preserved) are indented by the whitespace specified
with the `indent` option, default is two spaces.

Block quotes are indented according to `indent` and then prefixed with a
vertical pipe (|), you can change this prefix with the `blockquote` option.

Unless `autolink` is disabled links are removed and appended to the end
of the document such that the input:

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

HTML is normalized to text unless the `html` option is given in which case
it is passed through untouched.

* `opts` Object processing options.

### Options

* `autolink` Boolean=true create automatic links by index.
* `indent` String amount of whitespace indentation for code blocks.
* `preserve` Object map of node types that should be preserved.

## YamlRenderer

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

### Options

* `compact` Boolean=true create compact YAML documents.

