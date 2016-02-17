# glob-pair

Create source to destination mappings from globs. Geared toward usage for simple
CLI build tools. Created for [tacoscript].

[![build status](https://secure.travis-ci.org/forivall/glob-pair.svg)](http://travis-ci.org/forivall/glob-pair)
[![dependency status](https://david-dm.org/forivall/glob-pair.svg)](https://david-dm.org/forivall/glob-pair)

## Installation

```
npm install --save glob-pair
```

## Usage

Works similar to [lodash.zip](https://lodash.com/docs#zip), but with globs.

Except, if one value is given for the dest, all of the src values will be mapped
to it.

When multiple values are submitted for "dest", the same number of values must be
the "src" array.

```js
import globPair from "glob-pair";

globPair({src: ["*.scss"], dest: ["."], destExt: ".css"}, (src, dest) => {
  console.log(src, '->', dest); // a.scss -> a.css
}, (err) => {
  console.log(err || "Done!");
})

globPair({src: ["lib"], dest: ["dist"]}, (src, dest) => {
  console.log(src, '->', dest); // lib/index.js -> dist/lib/index.js
}, (err) => {
  console.log(err || "Done!");
})

globPair({src: ["src/*"], dest: ["lib"]}, (src, dest) => {
  console.log(src, '->', dest); // src/index.js -> lib/index.js
}, (err) => {
  console.log(err || "Done!");
})
```

## Credits
[Jordan Klassen](https://github.com/forivall/)

## Related modules

[expand-files]: Performs a similar function, but is more geared toward json
configuration | [homepage](https://github.com/jonschlinkert/expand-files)

## License

ISC

[tacoscript]: https://github.com/forivall/tacoscript
[expand-files]: https://www.npmjs.com/package/expand-files
