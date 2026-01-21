import cp from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const PBVERSION = '0.20.5';

const pblink = getPocketbaseLink();
const pbzippath = path.join(os.tmpdir(), 'pocketbase.zip');
await run('curl', ['-o', pbzippath, '-L', pblink]);

if (os.platform() == 'win32') {
	await run('TAR.EXE', ['-xf', pbzippath], { cwd: os.tmpdir() });
	await run('MOVE', [path.join(os.tmpdir(), 'pocketbase.exe'), 'pocketbase\\']);
	await run('DEL', ['/F', pbzippath]);
} else {
	await run('unzip', [pbzippath], { cwd: os.tmpdir() });
	await run('mv', [path.join(os.tmpdir(), 'pocketbase'), 'pocketbase/']);
	await run('rm', ['-f', pbzippath]);
}

function run(command, args = [], options = {}) {
	console.log('\x1b[43m', 'command', '\x1b[0m');
	console.log('\x1b[33m', command, args.join(' '), '\x1b[0m', '\n');

	return new Promise((resolve, reject) => {
		options.cwd = options.cwd || '.';

		if (os.platform() === 'win32') {
			options.execPath = 'CMD.EXE';
			options.execArgv = ['/C'];
		} else {
			options.execPath = 'bash';
			options.execArgv = ['-c'];
			command = command + ' ' + args.join(' ');
			args = [];
		}

		const p = cp.fork(command, args, options);

		p.on('error', (code) => {
			reject(code);
		});

		p.on('close', () => {
			resolve();
		});
	});
}

function getPocketbaseLink() {
	let platform = 'linux';
	let arch = 'amd64';

	if (os.arch() === 'arm64') {
		arch = 'arm64';
	} else if (os.arch() === 'armv7') {
		arch = 'armv7';
	}

	if (os.platform() == 'win32') {
		platform = 'windows';
	} else if (os.platform() === 'darwin') {
		platform = 'darwin';
	}

	return `https://github.com/pocketbase/pocketbase/releases/download/v${PBVERSION}/pocketbase_${PBVERSION}_${platform}_${arch}.zip`;
}
