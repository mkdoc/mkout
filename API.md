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

