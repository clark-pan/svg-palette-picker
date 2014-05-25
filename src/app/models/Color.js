var namespace = require('../namespace.js'),
	_ = require('lodash'),
	color = require('onecolor'),
	EventEmitter = require('events').EventEmitter;


namespace.factory('Color', ['$cacheFactory', function($cacheFactory){
	/**
	 * @constructor Color
	 * Represents a changable Color
	 *
	 * @extends {EventEmitter}
	 * 
	 * @property {String} id - a rgb/css value to key on
	 *
	 * @param {String} originalRgb - RGB color value in css or hex form
	 * @param {String} [modifiedRgb] - modified rgb value
	 */
	function Color(){
		EventEmitter.apply(this);

		var originalRgb, modifiedRgb;
		switch(arguments.length){
			case 0:
				throw 'Color: needs at least 1 rgb value';
			case 1:
				originalRgb = modifiedRgb = arguments[0];
			break;
			//jshint -W086
			case 2:
			default:
			//jshint +W086
				originalRgb = arguments[0];
				modifiedRgb = arguments[1];
		}
		this.id = Color.getId(originalRgb);

		this.setColor(modifiedRgb || originalRgb, true);
	}

	Color.prototype = _.create(EventEmitter.prototype, {
		constructor: Color,
		setColor : function(rgb, silent){
			var old = this._color;
			this._color = color(rgb);

			if(!silent){
				/**
				 * Update event
				 *
				 * @event Color#update
				 * @property {Color} event.target - the instance emitting the event
				 * @property {onecolor} event.newValue - the update color object
				 * @property {onecolor} event.oldValue - the old color object
				 */
				this.emit('update', {
					target : this,
					newValue : this._color,
					oldValue : old
				});
			}
		},
		getCss : function(){
			return this._color && this._color.css();
		},
		getRgb : function(){
			return this._color && this._color.rgb();
		},
		getHex : function(){
			return this._color && this._color.hex();
		},
		toJSON : function(){
			return {
				id : this.id,
				color : this.getHex()
			};
		}
	});

	_.assign(Color, {
		/**
		 * Normalizes an rgb string to the hex value to key on
		 * @param  {String} rgb - RGB value in css or hex form
		 * @return {String}
		 */
		getId: function(rgb){
			var colorObj = color(rgb);
			return colorObj && colorObj.hex();
		}
	});

	return Color;
}]);