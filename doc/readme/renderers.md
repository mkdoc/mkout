## Renderer Implementation

This section briefly describes the handling of the various [commonmark][] types, see the [api docs](/API.md) for more detail.

### Markdown

The markdown renderer renders all basic markdown types as expected however it is not yet [commonmark][] compliant which is work in progress.

### Text

The text renderer inherits from the markdown renderer so you can choose which types to preserve as markdown, by default headings and lists are preserved. Headings are preserved to maintain the document structure but you may disable rendering headings as markdown. List rendering is always performed using the underlying markdown renderer.

Block and inline HTML is normalized to text but may be preserved.

Links are converted to indexed references in the form `example[1]` and the appropriate references are appended to the document: `[1]: http://example.com`. Duplicate link destinations are resolved.

If you wanted to preserve some inline elements in addition to headings and lists you could pass the options:

```javascript
{preserve:{heading: true, code: true, emph: true, strong: true}}
```

### JSON

The JSON renderer allows serializing a node tree such that it could be passed between processes or pushed to a remote queue for further processing.

Circular references are resolved and the document has enough information to recreate a node tree with a 1:1 correlation with the original.

### YAML

The YAML renderer is designed to provide a compact view of the tree which is easy to read but can also include the node properties for an extended view of the document.

Whilst it would be possible to recreate a node tree from a YAML document it is optimized for legibility over processing; use the JSON renderer for serialization requirements.
