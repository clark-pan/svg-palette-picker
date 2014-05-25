var namespace = require('../namespace.js'),
	_ = require('lodash');

require('./colorPicker.js');

namespace.classy.controller({
	name : 'ColorSelectorCtrl',
	inject : ['$scope']
});

namespace.directive('colorSelector', [
	function(){
		return {
			restrict: "E",
			controller: 'ColorSelectorCtrl as ctrl',
			scope : {
				'palette' : '='
			},
			templateUrl : 'app/color-selector/colorSelector.tpl.html',
			replace : true
		};
	}
]);