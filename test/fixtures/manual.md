# ManRenderer

This document describes how ROFF macros are handled using the ManRenderer.

## Headings

Headings with a level of `1` are rendered using the `.SH` macro; deeper headings are rendered using the `.SS` macro. Remember that man pages only support two levels of heading.

## Emphasis

Words that are _emphasised_ are wrapped with the `\fI` and `\fR` macros.

## Strong

Words that are **bold** are wrapped with the `\fB` and `\fR` macros.

## Inline Code

Inline code can be formatted in one of three ways; specify the `inline` option to change the behaviour:

* None: `false`
* Emphasised: `'emph'`
* Bold: `'strong'`

The default behaviour is `strong`.

## Code Blocks

Code blocks are indented; this is how to generate the man page from this source document:

```shell
mkcat test/fixtures/manual.md | mkout --man
```

## Block Quotes

Block quotes are indented:

> Quotation text.

## HTML

Inline and block HTML markup is ignored when rendering to man pages, if you wish to include the content in HTML markup it should be normalized to text beforehand.

If you wish to preserve the raw HTML in the output use the `html` option.

