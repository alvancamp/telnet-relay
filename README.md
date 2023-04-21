# telnet-relay

A simple program that acts as a telnet relay, allowing many clients to connect to one server. Useful for strange servers which only allow a single client, such as Blackmagic HyperDecks.

## Installation and Usage (Windows)

Download and run the .exe file on the [latest release](https://github.com/alvancamp/telnet-relay/releases). Be sure to provide the `--connectToHost` argument, like so:

```bash
telnet-relay.exe --connectToHost 192.168.1.50
```

## Other Platforms

You'll need to compile and run the program as a Node.js script, rather than being able to just run a pre-made exe (make sure you have [Node.js 18](https://nodejs.org/en/download) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) installed first):

```bash
git clone https://github.com/alvancamp/telnet-relay.git
cd telnet-relay
yarn
yarn start --connectToHost 192.168.1.50
```
