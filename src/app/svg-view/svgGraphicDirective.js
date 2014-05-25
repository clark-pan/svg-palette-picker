var namespace = require('../namespace.js'),
	$ = require('jquery'),
	_ = require('lodash'),
	SvgUtils = require('../util/SvgUtils.js');

	require('../models/Color');

/**
 * @constructor svgGraphicDirective
 * Graphics directive that will register itself to a parent svgView
 */
var svgGraphicDirective = ['$window', 'Color', function($window, Color){
	return {
		restrict : 'E',
		require : '^?svgView',
		scope : {},
		link : function($scope, $element, $attr, svgViewCtrl){
			if(!svgViewCtrl){
				return;
			}
			var rawElement = $element[0];
			var fillId = SvgUtils.getColorKey(rawElement, 'fill');
			var strokeId = SvgUtils.getColorKey(rawElement, 'stroke');
			//Reset the default stroke-width of root svg to 0,
			//so setting the default color does not affect the border width of child elements
			//TODO revisit this
			if(rawElement.nodeName === 'svg'){
				rawElement.style.setProperty('stroke-width', 0);
			}

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