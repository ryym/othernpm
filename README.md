# :construction: WIP :construction:

# Othernpm

Othernpm provides a way to run npm commands in other directories.
A typical use of this module would be to run npm scripts of subdirectories
that have own `package.json`.

## Usage

### CLI

Othernpm allows you to specify a path where npm commands run.

```sh
# 'cd ./templates && npm install'
% onpm ./templates install
```

You can also define paths in `package.json` and use them to specify
a path.

```json
{
  "name": "package name",
  ...
  "othernpm": {
    "examples": "./examples",
    "site": "./site"
  }
}
```

```sh
# 'cd ./site && npm run build'
% onpm site run build

# 'cd ./examples && npm test'
% onpm examples test
```

### Node.js API

Othernpm also provides API used in Node.js scripts.
The module loads configurations from `package.json` automatically
so that you can use them as functions.

```javascript
const onpm = require('othernpm');

// Run the 'start' script in the examples directory.
onpm.example('start');

// Run the 'build' script in the site directory.
onpm.site('run build');

// Run npm commands in another directory.
onpm('./templates')('test');
```

The othernpm function returns a [spawn] object.

[spawn]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options

```javascript
const build = onpm.examples('run build');
build.on('exit', exitCode => console.log(exitCode));
```

## Installation

```sh
npm install --save-dev othernpm
```

## License

MIT
