# Renderers

<? @include readme/badges.md ?>

> Render documents to Markdown, Text, HTML, XML, YAML and JSON

Output renderers for [commonmark][].

<? @include {=readme} install.md ?>

## Usage

Create the stream and write a [commonmark][] document:

<? @source {javascript=s/\.\.\/index/mkcat/gm} usage.js ?>

<? @include {=readme} example.md renderers.md help.md ?>

<? @exec mkapi index.js lib/*.js --title=API --level=2 ?>
<? @include {=readme} license.md links.md ?>
