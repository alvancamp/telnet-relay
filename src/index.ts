import telnetlib = require('telnetlib')
import { argv } from './args'
import { Socket } from 'net'

let relayClient: telnetlib.TelnetSocket | null = null
let relayServerReady = false
const relayServerSockets: Set<Socket & telnetlib.TelnetSocket> = new Set()

createClientConnection()

const relayServer = telnetlib.createServer({ keepAlive: true }, (socket) => {
	const address = socket.address()
	if ('address' in address) {
		console.log(`New client connection from ${address.address}:${address.port}`)
	} else {
		console.log(`New client connection from unknown`)
	}

	// Whenever the relay server receives data, forward it to the relay client.
	socket.on('data', (data) => {
		console.log('FROM CLIENT:', data.toString('ascii'))
		if (relayClient) {
			relayClient.write(data)
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
	}

	console.log(`Connecting to server ${argv.connectToHost}:${argv.connectToPort}...`)

	const client = telnetlib.createConnection({
		host: argv.connectToHost,
		port: argv.connectToPort,
		keepAlive: true,
	})

	// Whenever the relay client receives data, forward it to all of the server's clients.
	client.on('data', (data) => {
		console.log('FROM SERVER:', data.toString('ascii'))
		if (relayServerReady) {
			for (const socket of relayServerSockets) {
				socket.write(data)
			}
		}
	})

	client.on('error', (error) => {
		console.error(`Connection error (${error.message}), retrying...`)
		relayClient = null
	})

	client.on('close', (hadError) => {
		if (!hadError) {
			console.error(`Connection to server closed, reconnecting...`)
		}
		relayClient = null
		createClientConnection()
	})

	client.on('ready', () => {
		console.log(`Connected to server ${argv.connectToHost}:${argv.connectToPort}`)
		relayClient = client
	})
}
