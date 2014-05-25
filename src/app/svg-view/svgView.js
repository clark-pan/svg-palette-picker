var namespace = require('../namespace.js'),
	$ = require('jquery'),
	_ = require('lodash'),
	color = require('onecolor'),
	SvgUtils = require('../util/SvgUtils.js');

require('./svgGraphicDirective.js');

/**
 * @constructor SvgViewCtrl
 * controller for the svg view. Provides methods to update child svg elements
 */
namespace.classy.controller({
	name : 'SvgViewCtrl',
	inject : ['$scope'],
	init : function(){
		_.bindAll(this, ['onColorChange']);
	},
	onColorChange: function(colors){
		this.$scope.$broadcast('updateColor', colors);
	},
	getColors: function(){
		return this.$scope.palette && this.$scope.palette.getColors();
	},
	watch: {
		'palette': function(palette, oldPalette){
			if(oldPalette){
				oldPalette.removeListener('update', this.onColorChange);
			}

			if(palette){
				palette.on('update', this.onColorChange);
			}
		}
	}
});

/**
 * @constructor svgView
 * Directive that encapsulates an svg display
 *
 * @param {expression} svg - raw svg text
 * @param {Palette} palette - Palette object to watch for changes on
 */
namespace.directive('svgView', [
	'$window', '$compile', '$animate',
	function($window, $compile, $animate){
		return {
			restrict : 'EA',
			require : 'svgView',
			controller : 'SvgViewCtrl',
			terminal : true,
			scope : {
				'svg' : '=',
				'palette' : '='
			},
			link : function($scope, $element, $attr, svgViewCtrl){
				var previousElement, currentElement, currentScope;
				var cleanupLastIncludeContent = function() {
					if(previousElement) {
						previousElement.remove();
						previousElement = null;
					}
					if(currentScope) {
						currentScope.$destroy();
						currentScope = null;
					}
					if(currentElement) {
						$animate.leave(currentElement, function() {
							previousElement = null;
						});
						previousElement = currentElement;
						currentElement = null;
					}
				};

				$scope.$watch('svg', function(svgString){
					var newElement = $window.document.createElement('div');
					cleanupLastIncludeContent();
					if(svgString){
						var compiled = SvgUtils.parseSvg(svgString);

						if(compiled){
							newElement.appendChild(compiled.documentElement);

							$animate.enter(newElement, $element);

							var newScope = $scope.$new();
							$compile(newElement)(newScope);

							currentScope = newScope;
							currentElement = newElement;
						} else {
							//TODO figure out error display
						}
					}
				});
			}
		};
	}
]);