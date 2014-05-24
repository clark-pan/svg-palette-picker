var namespace = require('../namespace.js');


namespace.factory('SvgDocument', ['$resource', function($resource){
	/**
	 * @constructor SvgDocument
	 * Represents a user's available SvgDocument
	 * 
	 * @extends {$resource}
	 *
	 * @property {String} id
	 * @property {String} svgUrl - url to the raw asset
	 * @property {Object} palette - A key/value pair of modifications made to this palette
	 */
	return SvgDocument = $resource('/api/svg/:id.json');
}]);