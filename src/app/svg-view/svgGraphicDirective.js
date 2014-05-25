var namespace = require('../namespace.js'),
	$ = require('jquery'),
	_ = require('lodash');

	require('../models/Color');

/**
 * @constructor svgGraphicDirective
 * Graphics directive that will register itself to a parent svgView
 */
var svgGraphicDirective = ['Color', function(Color){
	var COLOR_DEFAULTS = {
		FILL : '#000000',
		STROKE : '#000000'
	};

	return {
		restrict : 'E',
		require : '^?svgView',
		scope : {},
		link : function($scope, $element, $attr, svgViewCtrl){
			if(!svgViewCtrl){
				return;
			}
			var rawElement = $element[0];
			var style = rawElement.style;
			var fillId = Color.getId(style.fill || rawElement.getAttribute('fill') || COLOR_DEFAULTS.FILL);
			var strokeId = Color.getId(style.stroke || rawElement.getAttribute('stroke') || COLOR_DEFAULTS.STROKE);

			$scope.$on('updateColor', function(event, colors){
				updateColor(colors);
			});

			updateColor(svgViewCtrl.getColors() || {});

			function updateColor(colors){
				var fillColor = colors[fillId];
				if(fillColor){
					style.setProperty('fill', fillColor.getCss());
				}

				var strokeColor = colors[strokeId];
				if(strokeColor){
					style.setProperty('stroke', strokeColor.getCss());
				}
			}
		}
	};
}];

//List of SVG elements from : https://developer.mozilla.org/en-US/docs/Web/SVG/Element#Graphics_elements
_.each([
	"circle",
	"ellipse",
	"image",
	"line",
	"path",
	"polygon",
	"polyline",
	"rect",
	"text",
	"use"
], _.compose(_.partialRight(_.bind(namespace.directive, namespace), svgGraphicDirective), _.identity)
);