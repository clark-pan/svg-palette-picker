var namespace = require('../namespace.js'),
	_ = require('lodash'),
	SvgUtils = require('../util/SvgUtils.js');


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
	var SvgDocument = $resource('/data/documents/:id', {'id' : '@id'}, {
		'query':  {method:'GET', isArray:true, url:'/data/documents'}
	});
	return SvgDocument;
}]);