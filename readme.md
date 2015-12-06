# del-cli [![Build Status](https://travis-ci.org/sindresorhus/del-cli.svg?branch=master)](https://travis-ci.org/sindresorhus/del-cli)

> Delete files and folders

Useful for use in build scripts and automated things.

*Note that this does permanent deletion. See [`trash-cli`](https://github.com/sindresorhus/trash-cli) for something safer.*


## Install

```
$ npm install --global del-cli
```


## Usage

```
$ de --help

  Usage
    $ de <path|glob> [...]

  Options
    -f, --force    Allow deleting the current working directory and outside
    -d, --dry-run  List what would be deleted instead of deleting

  Examples
    $ de unicorn.png rainbow.png
    $ de '*.png' '!unicorn.png'
```

It's `de` and not `del`, since `del` is already a builtin command on Windows.


## Related

- [del](https://github.com/sindresorhus/del) - API for this module
- [trash-cli](https://github.com/sindresorhus/trash-cli) - Move files and folders to the trash


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
