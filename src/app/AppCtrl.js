var namespace = require('./namespace.js');

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
		var Palette = this.Palette;
		this.$http.get('/sample_data/Wien_3_Wappen.svg').then(function(response){
			$scope.document = {
				svg : response.data
			};
		});

		//Test data for now
		//TODO remove
		$scope.palette = new Palette();
		$scope.palette.addColors([
			{
				id : "#000000",
				color : "#FF0000"
			}
		]);

		setInterval(function(){
			$scope.$apply(function(){
				var firstColor = $scope.palette.getColors()['#000000'];
				firstColor.setColor('#' + Math.floor(Math.random() * Math.pow(256, 3)).toString(16));
			});
		}, 500);
	}
});