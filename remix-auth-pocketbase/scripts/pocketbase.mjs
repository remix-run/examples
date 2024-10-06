import cp from 'node:child_process';
import os from 'node:os';

if (os.platform() == 'win32') {
	await run('.\\pocketbase\\pocketbase.exe',['serve']);
} else {
	await run('./pocketbase/pocketbase',['serve']);
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