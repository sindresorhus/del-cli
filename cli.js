#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import {deleteAsync} from 'del';

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
	importMeta: import.meta,
	flags: {
		force: {
			type: 'boolean',
			alias: 'f',
		},
		dryRun: {
			type: 'boolean',
			alias: 'd',
		},
	},
});

if (cli.input.length === 0) {
	console.error('Specify at least one path');
	process.exitCode = 1;
} else {
	const files = await deleteAsync(cli.input, cli.flags);

	if (cli.flags.dryRun) {
		console.log(files.join('\n'));
	}
}
