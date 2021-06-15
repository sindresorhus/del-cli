import fs from 'node:fs';
import test from 'ava';
import tempWrite from 'temp-write';
import execa from 'execa';

test('main', async t => {
	const filename = tempWrite.sync('foo');
	await execa('./cli.js', ['--force', filename]);
	t.false(fs.existsSync(filename));
});
