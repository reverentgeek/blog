"use strict";

module.exports = {
	env: {
		node: true,
		browser: true,
		commonjs: true,
		es6: true
	},
	extends: "reverentgeek/node",
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	}
};
