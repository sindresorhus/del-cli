#!/usr/bin/env node
'use strict';
var meow = require('meow');
var del = require('del');

var cli = meow([
	'Usage',
	'  $ del <path|glob> [...]',
	'',
	'Options',
	'  -f, --force    Allow deleting the current working directory and outside',
	'  -d, --dry-run  List what would be deleted instead of deleting',
	'  --skip-update  Do not check after updated version of this package',
	'',
	'Examples',
	'  $ del unicorn.png rainbow.png',
	'  $ del \'*.png\' \'!unicorn.png\''
], {
	string: ['_'],
	boolean: [
		'force',
		'dry-run',
		'skip-update'
	],
	alias: {
		f: 'force',
		d: 'dry-run'
	}
});

if (!cli.flags.skipUpdate) {
	var updateNotifier = require('update-notifier');

	updateNotifier({pkg: cli.pkg}).notify();
}

if (cli.input.length === 0) {
	console.error('Specify at least one path');
	process.exit(1);
}

del(cli.input, cli.flags).then(function (files) {
	if (cli.flags.dryRun) {
		console.log(files.join('\n'));
	}
});
