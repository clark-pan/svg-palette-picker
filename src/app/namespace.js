var angular = require('angular');

var namespace = angular.module('svg-palette-picker', [
	'ngResource',
	'classy',
	'svg-palette-picker-templates'
]);

namespace.classy.options.controller = {
	addFnsToScope : false
};

module.exports = namespace;