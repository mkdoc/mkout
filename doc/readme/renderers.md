## Renderer Implementation

This section briefly describes the handling of the various [commonmark][] types, see the [api docs](/API.md) for more detail.

### Text

The text renderer inherits from the markdown renderer so you can choose which types to preserve as markdown, by default headings and lists are preserved as markdown. Headings are preserved to maintain the document structure but you may disable rendering headings as markdown. List rendering is always performed using the underlying markdown renderer.

Block and inline HTML is normalized to text but may be preserved.

Links are converted to indexed references in the form `example[1]` and the appropriate references are appended to the document: `[1]: http://example.com`. Duplicate link destinations are resolved.

If you wanted to preserve some inline elements in addition to headings and lists you could pass the options:

```javascript
{preserve:{heading: true, code: true, emph: true, strong: true}}
```
