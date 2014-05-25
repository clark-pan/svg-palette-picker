var namespace = require('../namespace.js'),
	$ = require('jquery'),
	_ = require('lodash');

	require('../models/Color');

/**
 * @constructor svgGraphicDirective
 * Graphics directive that will register itself to a parent svgView
 */
var svgGraphicDirective = ['$window', 'Color', function($window, Color){
	var SVG_DEFAULTS = {
		fill : '#000000',
		stroke : '#000000'
	};

	/**
	 * Encapsulates the logic of finding a color to key on for an element
	 * 
	 * @param  {Element} rawElement - element to search on
	 * @param  {'fill' | 'stroke'} property - color property to find
	 * @return {String | falsy}
	 */
	function getColorKey(rawElement, property){
		var style = rawElement.style;

		return style[property] || //Style overrides attribute
			rawElement.getAttribute(property) ||
			(rawElement.nodeName === 'svg' && SVG_DEFAULTS[property]); //We use the fill and stroke properties of the root svg elements to define the defaults
	}

	/**
	 * Encapsulates the logic for determining whether or not this element has a stroke applied to it
	 * @param  {Element} rawElement - element to determine
	 * @return {Boolean}
	 */
	function hasStroke(rawElement){
		var style = rawElement.style;

		return style['stroke-width'] || //Style overrides attribute
			rawElement.getAttribute('stroke-width');
	}

	return {
		restrict : 'E',
		require : '^?svgView',
		scope : {},
		link : function($scope, $element, $attr, svgViewCtrl){
			if(!svgViewCtrl){
				return;
			}
			var rawElement = $element[0];
			var fillId = getColorKey(rawElement, 'fill');
			var hasStrokeProperty = hasStroke(rawElement);
			var strokeId = hasStrokeProperty && getColorKey(rawElement, 'stroke');
			if(fillId){
				//Normalize the id
				fillId = Color.getId(fillId);
			}
			if(strokeId){
				strokeId = Color.getId(strokeId);
			}

			$scope.$on('updateColor', function(event, colors){
				updateColor(colors);
			});

			updateColor(svgViewCtrl.getColors() || {});

			function updateColor(colors){
				var fillColor = colors[fillId];
				if(fillId && fillColor){
					rawElement.style.setProperty('fill', fillColor.getCss());
				}

				var strokeColor = colors[strokeId];
				if(strokeId && strokeColor){
					rawElement.style.setProperty('stroke', strokeColor.getCss());
				}
			}
		}
	};
}];


_.each([
	//List of graphics elements from : https://developer.mozilla.org/en-US/docs/Web/SVG/Element#Graphics_elements
	"circle",
	"ellipse",
	"image",
	"line",
	"path",
	"polygon",
	"polyline",
	"rect",
	"text",
	"use",
	"a",
	"defs",
	"glyph",
	//List of container elements : https://developer.mozilla.org/en-US/docs/Web/SVG/Element#Container_elements
	//TODO probably best to seperate these two types out, but it works for now
	"g",
	"marker",
	"mask",
	"missing-glyph",
	"pattern",
	"svg",
	"switch",
	"symbol"
], _.compose(_.partialRight(_.bind(namespace.directive, namespace), svgGraphicDirective), _.identity)
);