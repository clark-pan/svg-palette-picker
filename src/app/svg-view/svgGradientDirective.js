var namespace = require('../namespace.js'),
	_ = require('lodash'),
	SvgUtils = require('../util/SvgUtils.js');

	require('../models/Color');

/**
 * @constructor svgStopDirective
 * Directive that augments a gradient stop
 */
namespace.directive('stop', ['Color', function(Color){
	return {
		restrict : 'E',
		require : '^?svgView',
		scope : {},
		link : function($scope, $element, $attr, svgViewCtrl){
			if(!svgViewCtrl){
				return;
			}
			var rawElement = $element[0];
			var stopId = SvgUtils.getColorKey(rawElement, 'stop-color');

			console.log('foo', stopId);

			if(stopId){
				//Normalize the id
				stopId = Color.getId(stopId);
				$scope.$on('updateColor', function(event, colors){
					updateColor(colors);
				});

				updateColor(svgViewCtrl.getColors() || {});
			}

			function updateColor(colors){
				var stopColor = colors[stopId];
				if(stopId && stopColor){
					rawElement.style.setProperty('stop-color', stopColor.getHex());
				}
			}
		}
	};
}]);