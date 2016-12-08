import fs from 'fs';
import test from 'ava';
import tempWrite from 'temp-write';

global.Promise = Promise;
const execa = require('execa');

test(async t => {
	const filename = tempWrite.sync('foo');
	await execa('./cli.js', ['--force', filename]);
	t.false(fs.existsSync(filename));
});
