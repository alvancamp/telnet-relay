# telnet-relay

A simple program that acts as a telnet relay, allowing many clients to connect to one server. Useful for strange servers which only allow a single client, such as Blackmagic HyperDecks.

## Installation and Usage (Windows, macOS, and Linux)

Download and run the executable file for your OS from the [latest release](https://github.com/alvancamp/telnet-relay/releases). Be sure to provide the `--connectToHost` argument, like so:

```bash
telnet-relay.exe --connectToHost 192.168.1.50
```

## Development

Make sure you have [Node.js 18](https://nodejs.org/en/download) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) installed, then:

```bash
git clone https://github.com/alvancamp/telnet-relay.git
cd telnet-relay
yarn
yarn start --connectToHost 192.168.1.50
```
