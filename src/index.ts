import telnetlib = require('telnetlib')
import { argv } from './args'
import { Socket } from 'net'
import exitHook from './exit-hook'

let handshakeResponse: string[] = []
let relayClient: telnetlib.TelnetSocket | null = null
let relayServerReady = false
const relayServerSockets: Set<Socket & telnetlib.TelnetSocket> = new Set()

createClientConnection()

const relayServer = telnetlib.createServer({ keepAlive: true }, (socket) => {
	console.log(`New client connection`)

	socket.setEncoding('utf8')

	socket.on('negotiated', () => {
		if (argv.hyperdeck) {
			for (const line of handshakeResponse) {
				socket.write(line)
			}
		} else {
			socket.write(`Connected. (Proxied to ${argv.connectToHost}:${argv.connectToPort})\n\r`)
		}
		relayServerSockets.add(socket)
	})

	// Whenever the relay server receives data, forward it to the relay client.
	socket.on('data', (data) => {
		const str = data.toString('utf8')

		// HyperDeck-specific handling goes here.
		if (argv.hyperdeck) {
			if (str.startsWith('quit')) {
				socket.destroy()
				return
			}

			if (str.startsWith('watchdog')) {
				return
			}

			if (str.startsWith('period') || str.startsWith('ping')) {
				// drop the command and fake a response, we don't want them in this proxy setup.
				socket.write(' 200 ok\n\r')
				return
			}
		}

		process.stdout.write('FROM CLIENT:' + str)
		if (relayClient) {
			relayClient.write(data)
		} else {
			console.log('Relay unavailable, command dropped.')
		}
	})

	socket.on('close', () => {
		relayServerSockets.delete(socket)
	})

	socket.on('end', () => {
		relayServerSockets.delete(socket)
	})
})

relayServer.listen(argv.listenOnPort, () => {
	console.log('Relay server listening on port', argv.listenOnPort)
	relayServerReady = true
})

function createClientConnection() {
	// Ensure we have only one relay client.
	if (relayClient) {
		relayClient.destroy()
		relayClient = null
		handshakeResponse = []
	}

	let connected = false

	console.log(`Connecting to server ${argv.connectToHost}:${argv.connectToPort}...`)

	const client = telnetlib.createConnection({
		host: argv.connectToHost,
		port: argv.connectToPort,
		keepAlive: true,
	})

	// Whenever the relay client receives data, forward it to all of the server's clients.
	client.on('data', (data) => {
		if (!connected) {
			console.log(`Connected to server ${argv.connectToHost}:${argv.connectToPort}`)
			connected = true
			relayClient = client
		}

		process.stdout.write('FROM SERVER: ' + data.toString('utf8'))

		// The HyperDeck handshake is the first four lines sent.
		if (argv.hyperdeck && handshakeResponse.length < 4) {
			handshakeResponse.push(data.toString('utf8'))
		}

		if (relayServerReady) {
			for (const socket of relayServerSockets) {
				socket.write(data)
			}
		} else {
			console.log("Not relaying because the relay server isn't ready")
		}
	})

	client.on('error', (error) => {
		console.error(`Connection error (${error.message}), retrying...`)
		relayClient = null
		handshakeResponse = []
		createClientConnection()
	})

	client.on('close', (hadError) => {
		if (!hadError) {
			console.error(`Connection to server closed, reconnecting...`)
			relayClient = null
			handshakeResponse = []
			createClientConnection()
		}
	})
}

exitHook(() => {
	process.stdout.write('Cleaning up before exit...')
	if (relayClient) {
		relayClient.write('quit\n\r')
		relayClient.destroy()
	}
	console.log(' done!')
})
