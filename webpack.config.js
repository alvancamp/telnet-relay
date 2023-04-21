const path = require('path')

const shared = {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.build.json',
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	target: 'node18.16',
	externals: {},
}

module.exports = [
	{
		...shared,
		entry: './src/index.ts',
		output: {
			filename: 'telnet-relay.js',
			path: path.resolve(__dirname, 'dist'),
		},
	},
	{
		...shared,
		entry: './src/build-binary.ts',
		output: {
			filename: 'build-binary.js',
			path: path.resolve(__dirname, 'dist'),
		},
	},
]
