/**
 * Trailpack Configuration
 * (app.config.main)
 *
 * @see http://trailsjs.io/doc/config/main
 */

import * as path from 'path';

export = {

	/**
	 * Order does *not* matter. Each module is loaded according to its own
	 * requirements.
	 */
	packs: [
		require('trailpack-repl'),
		require('trailpack-router'),
		require('trailpack-express')
	],

	/**
	 * Define application paths here. "root" is the only required path.
	 */
	paths: {
		root: path.resolve(__dirname, '..'),
		temp: path.resolve(__dirname, '..', '.tmp')
	}
};
