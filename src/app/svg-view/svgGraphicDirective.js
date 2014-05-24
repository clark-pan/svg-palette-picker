var namespace = require('../namespace.js'),
	$ = require('jquery'),
	_ = require('lodash');

/**
 * @constructor svgGraphicDirective
 * Graphics directive that will register itself to a parent svgView
 */
var svgGraphicDirective = [function(){
	return {
		restrict : 'E',
		require : '^?svgView',
		link : function($scope, $element, $attr, svgViewCtrl){
			if(!svgViewCtrl){
				return;
			}
			svgViewCtrl.registerElement($element[0]);
			$element.on('$destroy', _.partial(svgViewCtrl.deregisterElement, svgViewCtrl, $element[0]));
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