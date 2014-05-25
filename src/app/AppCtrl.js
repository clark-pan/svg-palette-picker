var namespace = require('./namespace.js'),
	_ = require('lodash');

//Models
require('./models/SvgDocument.js');
require('./models/Color.js');
require('./models/Palette.js');

//Views
require('./svg-view/svgView.js');

/**
 * @constructor AppCtrl
 * Main controller for the application. Acts as the mediator between the various views
 */
namespace.classy.controller({
	name : 'AppCtrl',
	inject : ['$scope', '$http', 'Palette'],
	templateUrl : 'app/app.tpl.html',
	init : function(){
		var $scope = this.$scope;
		var $http = this.$http;
		var Palette = this.Palette;
		$http.get('/data/documents').then(function(response){
			var documents = response.data;
			var data = documents[0];
			$http.get(data.svgUrl).then(function(response){
				$scope.document = {
					svg : response.data
				};
			});

			$scope.palette = new Palette(data.palette);
		});

		setInterval(function(){
			$scope.$apply(function(){
				var randomColor = _.shuffle($scope.palette.getColors())[0];
				randomColor.setColor('#' + Math.floor(Math.random() * Math.pow(256, 3)).toString(16));
			});
		}, 1000);
	}
});