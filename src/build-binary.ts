import * as fs from 'fs'
import { execSync } from 'child_process'

const nodePath = process.execPath

process.stdout.write('Copying node executable...')
fs.copyFileSync(nodePath, 'dist/telnet-relay' + process.platform === 'win32' ? '.exe' : '')
console.log(' done!')

process.stdout.write('Compiling code into exe...')
execSync(
	`npx postject dist/telnet-relay${
		process.platform === 'win32' ? '.exe' : ''
	} NODE_JS_CODE dist/telnet-relay.js --sentinel-fuse NODE_JS_FUSE_fce680ab2cc467b6e072b8b5df1996b2`
)
console.log(' done!')
