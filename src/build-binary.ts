import * as fs from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

main().catch((error) => {
	throw error
})

async function main() {
	const nodePath = await fs.realpath(process.execPath)
	process.stdout.write('Copying node executable...')
	await fs.copyFile(nodePath, 'dist/telnet-relay' + (process.platform === 'win32' ? '.exe' : ''))
	console.log(' done!')

	process.stdout.write('Injecting code into exe...')
	await execPromise(
		`npx postject dist/telnet-relay${
			process.platform === 'win32' ? '.exe' : ''
		} NODE_JS_CODE dist/telnet-relay.js --sentinel-fuse NODE_JS_FUSE_fce680ab2cc467b6e072b8b5df1996b2`
	)
	console.log(' done!')
}
