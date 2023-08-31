import fs from 'node:fs';
import test from 'ava';
import tempWrite from 'temp-write';
import {execa} from 'execa';

test('main', async t => {
	const filename = tempWrite.sync('foo');
	await execa('./cli.js', ['--force', filename]);
	t.false(fs.existsSync(filename));
});

test('verbose file exists', async t => {
	const filename = tempWrite.sync('foo');
	const {stdout} = await execa('./cli.js', ['--force', '--verbose', filename]);
	t.is(stdout, filename);
});

test('verbose file does not exist', async t => {
	const {stdout} = await execa('./cli.js', ['--verbose', 'does-not-exist.txt']);
	t.is(stdout, '');
});
