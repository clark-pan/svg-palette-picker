var namespace = require('../namespace.js'),
	_ = require('lodash'),
	color = require('onecolor');


namespace.factory('Color', [function(){
	/**
	 * @constructor Color
	 * Represents a changable Color
	 * 
	 * 
	 * @property {String} id - a rgb/css value to key on
	 * @property {onecolor} color - A one color object
	 *
	 * @param {String} originalRgb - RGB color value in css or hex form
	 * @param {String} [modifiedRgb] - modified rgb value
	 */
	function Color(){
		var originalRgb, modifiedRgb;
		switch(arguments.length){
			case 0:
				throw 'Color: needs at least 1 rgb value';
			case 1:
				originalRgb = modifiedRgb = arguments[0];
			case 2:
			default:
				originalRgb = arguments[0];
				modifiedRgb = arguments[1];
		}
		this.id = Color.getId(originalRgb);

		this.setColor(modifiedRgb || originalRgb);
	}

	Color.prototype = {
		constructor: Color,
		setColor : function(rgb){
			this.color = color(rgb);
		}
	};

	_.assign(Color, {
		/**
		 * Normalizes an rgb string to the hex value to key on
		 * @param  {String} rgb - RGB value in css or hex form
		 * @return {String}
		 */
		getId: function(rgb){
			return color(rgb).hex();
		}
	});

	return Color;
}]);