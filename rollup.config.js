import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const getConfig = function (isMinify) {
	const config = {
		input: 'dist/index.js',
		output: {
			name: 'jquery-table-fixed-header',
			format: 'umd',
			globals: {
				jquery: 'jQuery'
			},
			file: `dist/jquery-table-fixed-header${isMinify ? '.min' : ''}.js`,
		},
		external: ['jquery'],
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			isMinify && terser()
		],
	};

	return config;
};

export default [
	getConfig(false),
	getConfig(true)
];
