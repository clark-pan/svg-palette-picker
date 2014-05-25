var namespace = require('../namespace'),
	_ = require('lodash'),
	EventEmitter = require('events').EventEmitter;

	require('./Color.js');

namespace.factory('Palette', ['Color', '$cacheFactory', function(Color, $cacheFactory){
	/**
	 * @constructor Palette
	 * Represents a collection of colors
	 *
	 * @extends {EventEmitter}
	 */
	function Palette(colors){
		this._colors = {};
		EventEmitter.apply(this);

		_.bindAll(this, ['_onColorUpdate']);

		this.addColors(colors, true);
	}

	Palette.prototype = _.create(EventEmitter.prototype, {
		/**
		 * Update event
		 *
		 * @event Palette#update
		 * @property {Palette} event.target - the instance emitting the event
		 * @property {colors[]} colors - An array of colors that have changed
		 */
		constructor: Palette,
		/**
		 * Adds some colors to this palette
		 * @param {String | String[] | Object | Object[]} colors - 
		 */
		addColors : function(colors, silent){
			var _this = this,
				updatedColors = [];

			if(!colors) {
				return;
			}

			if(_.isPlainObject(colors)){
				colors = _.map(colors, function(value, key){
					return {
						id : key,
						color : value
					};
				});
			} else if(!_.isArray(colors)){
				colors = [colors];
			}

			updatedColors = _.chain(colors)
				.map(function(value){
					var id, colorObj;
					if(value instanceof Color){
						colorObj = value;
					} else if (_.isObject(value)){
						colorObj = new Color(value.id, value.color);
					} else {
						colorObj = new Color(value && value.toString());
					}

					id = colorObj.id;

					if(_this._colors.hasOwnProperty(id)){
						_this._colors[id].setColor(colorObj.getCss(), true);
						colorObj = _this._colors[id];
					} else {
						_this._colors[id] = colorObj;
						colorObj.on('update', _this._onColorUpdate);
					}

					return colorObj;
				})
				.indexBy(_.property('id'))
				.value();

			if(!silent){
				this.emit('update', updatedColors);
			}
		},
		getColors : function(){
			return this._colors;
		},
		_onColorUpdate: function(event){
			var target = event.target;
			var colors = {};
			colors[target.id] = target;
			this.emit('update', colors);
		},
		toJSON : function(){
			return _.map(this._colors, function(value){
				return value.toJSON();
			});
		}
	});
	
	return Palette;
}]);