var namespace = require('../namespace.js'),
	_ = require('lodash');

namespace.directive('colorPicker', ['Color', function(Color){
	return {
		restrict : 'A',
		scope : {
			'colorModel' : '=colorPicker'
		},
		link : function($scope, $element, $attr){
			$scope.$watch('colorModel', function(colorModel, previousModel){
				unbindListeners(previousModel);

				if(colorModel instanceof Color){
					bindListeners(colorModel);
					$element.val(colorModel.getHex());
					$element.removeAttr('disabled');
				} else {
					$element.attr('disabled', true);
				}
			});

			$element.on('change', function(){
				$scope.$apply(function(){
					if($scope.colorModel){
						$scope.colorModel.setColor($element.val());
					}
				});
			});

			function bindListeners(model){
				if(model){
					model.on('update', onColorModelChange);
				}
			}

			function unbindListeners(model){
				if(model){
					model.removeListener('update', onColorModelChange);
				}
			}

			function onColorModelChange(eventData){
				var colorModel = eventData.target;
				$element.val(colorModel.getHex());
			}
		}
	};
}]);