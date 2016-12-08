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
$ del --help

  Usage
    $ del <path|glob> [...]

  Options
    -f, --force    Allow deleting the current working directory and outside
    -d, --dry-run  List what would be deleted instead of deleting

  Examples
    $ del unicorn.png rainbow.png
    $ del '*.png' '!unicorn.png'
```

Since `$ del` is already a builtin command on Windows you need to use `$ del-cli` there.

If preferred, a simple alias could fix this of course.

```
	alias del=de
```


## Related

- [del](https://github.com/sindresorhus/del) - API for this module
- [trash-cli](https://github.com/sindresorhus/trash-cli) - Move files and folders to the trash


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
