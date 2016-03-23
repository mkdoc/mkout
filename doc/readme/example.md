## Example

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
