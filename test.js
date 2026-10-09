import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import tempWrite from 'temp-write';
import {execa} from 'execa';

test('main', async () => {
	const filename = tempWrite.sync('foo');
	await execa('./cli.js', ['--force', filename]);
	assert.ok(!fs.existsSync(filename));
});

test('del bin', async () => {
	const filename = tempWrite.sync('foo');
	await execa('./del.js', ['--force', filename]);
	assert.ok(!fs.existsSync(filename));
});

test('verbose file exists', async () => {
	const filename = tempWrite.sync('foo');
	const {stdout} = await execa('./cli.js', ['--force', '--verbose', filename]);
	assert.equal(stdout, filename);
});

test('verbose file does not exist', async () => {
	const {stdout} = await execa('./cli.js', ['--verbose', 'does-not-exist.txt']);
	assert.equal(stdout, '');
});

test('dry-run with files to delete', async () => {
	const filename = tempWrite.sync('foo');
	const {stdout} = await execa('./cli.js', ['--dry-run', '--force', filename]);
	assert.equal(stdout, filename);
	// File should still exist after dry run
	assert.ok(fs.existsSync(filename));
});

test('dry-run with no files to delete', async () => {
	const {stdout} = await execa('./cli.js', ['--dry-run', 'does-not-exist-*.txt']);
	assert.equal(stdout, '');
});

test('only negated patterns delete nothing', async () => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'del-cli-'));
	fs.writeFileSync(path.join(directory, 'keep.js'), '');
	fs.writeFileSync(path.join(directory, 'other.js'), '');

	const {stdout} = await execa(path.resolve('cli.js'), ['--verbose', '!keep.js'], {cwd: directory});
	assert.equal(stdout, '');
	assert.ok(fs.existsSync(path.join(directory, 'other.js')));

	fs.rmSync(directory, {recursive: true, force: true});
});

test('verbose + dry-run does not duplicate output', async () => {
	const filename = tempWrite.sync('foo');
	const {stdout} = await execa('./cli.js', ['--verbose', '--dry-run', '--force', filename]);
	// Should only print the filename once, not twice
	assert.equal(stdout, filename);
});

test('verbose + dry-run with multiple files', async () => {
	const file1 = tempWrite.sync('foo');
	const file2 = tempWrite.sync('bar');
	const {stdout} = await execa('./cli.js', ['--verbose', '--dry-run', '--force', file1, file2]);
	const lines = stdout.split('\n');
	// Should have exactly 2 lines (one per file)
	assert.equal(lines.length, 2);
	assert.ok(lines.includes(file1));
	assert.ok(lines.includes(file2));
});

test('handles errors gracefully', async () => {
	// Test with an invalid operation that should throw an error.
	// Deleting outside the current working directory without `--force` is refused before anything is deleted.
	// `assert.rejects` returns nothing, so capture the error ourselves.
	const filename = tempWrite.sync('foo');
	let error;
	try {
		await execa('./cli.js', [filename]);
	} catch (error_) {
		error = error_;
	}

	// Should be an error, exiting with code 1
	assert.ok(error instanceof Error);
	assert.equal(error.exitCode, 1);
	assert.match(error.stderr, /outside the current working directory/v);
	assert.ok(fs.existsSync(filename));
});

test('handles directory paths with trailing slash', async () => {
	// Create a temp file and get its directory
	const filePath = tempWrite.sync('test');
	const directory = filePath.slice(0, filePath.lastIndexOf('/'));

	// Create a subdirectory to safely test
	const testDirectory = `${directory}/test-del-dir`;
	fs.mkdirSync(testDirectory);
	fs.writeFileSync(`${testDirectory}/file.txt`, 'test');

	// Test with trailing slash
	const {stdout: stdout1} = await execa('./cli.js', ['--dry-run', '--force', `${testDirectory}/`]);
	assert.equal(stdout1, testDirectory);

	// Test without trailing slash
	const {stdout: stdout2} = await execa('./cli.js', ['--dry-run', '--force', testDirectory]);
	assert.equal(stdout2, testDirectory);

	// Both should resolve to the same path
	assert.equal(stdout1, stdout2);

	// Clean up
	fs.rmSync(testDirectory, {recursive: true, force: true});
});

test('deletes directories with trailing slash', async () => {
	// Create a temp file and get its directory
	const filePath = tempWrite.sync('test');
	const directory = filePath.slice(0, filePath.lastIndexOf('/'));

	// Create a subdirectory to safely test
	const testDirectory = `${directory}/test-del-dir2`;
	fs.mkdirSync(testDirectory);
	fs.writeFileSync(`${testDirectory}/file.txt`, 'test');

	// Delete with trailing slash
	await execa('./cli.js', ['--force', `${testDirectory}/`]);

	// Directory should no longer exist
	assert.ok(!fs.existsSync(testDirectory));
});
