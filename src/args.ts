import yargs = require('yargs/yargs')
import { hideBin } from 'yargs/helpers'

export const argv = yargs(hideBin(process.argv))
	.option('listenOnPort', {
		type: 'number',
		description: 'The port for the server to listen on',
		default: 9993, // same port as HyperDeck
	})
	.option('connectToPort', {
		type: 'number',
		description: 'The port for the client to connect to',
		default: 9993, // same port as HyperDeck
	})
	.option('connectToHost', {
		type: 'string',
		description: 'The host for the client to connect to',
		demandOption: true,
	})
	.option('hyperdeck', {
		type: 'boolean',
		description: 'Whether or not to specifically handle Blackmagic HyperDecks, which need extra care...',
		default: true,
	})
	.parseSync()
