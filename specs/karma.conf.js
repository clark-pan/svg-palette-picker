module.exports = function(config){
	var _ = require('lodash');

	var pkg = require('../package.json');
	var buildVars = require('../build/build.json');

	config.set({
		basePath: '../',
		files : buildVars.karmaFiles,
		frameworks : ['jasmine'],
		plugins : [
			'karma-jasmine',
			'karma-phantomjs-launcher'
		],
		reporters: ['dots'],
		browsers: ['PhantomJS']
	});
}