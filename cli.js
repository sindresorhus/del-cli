#!/usr/bin/env node
'use strict';
const meow = require('meow');
const del = require('del');

const cli = meow(`
	Usage
	  $ del <path|glob> …

	Options
	  --force, -f    Allow deleting the current working directory and outside
	  --dry-run, -d  List what would be deleted instead of deleting

	Examples
	  $ del unicorn.png rainbow.png
	  $ del "*.png" "!unicorn.png"
`, {
	flags: {
		force: {
			type: 'boolean',
			alias: 'f'
		},
		dryRun: {
			type: 'boolean',
			alias: 'd'
		}
	}
});

(async () => {
	if (cli.input.length === 0) {
		console.error('Specify at least one path');
		process.exitCode = 1;
		return;
	}

	const files = await del(cli.input, cli.flags);

	if (cli.flags.dryRun) {
		console.log(files.join('\n'));
	}
})();
