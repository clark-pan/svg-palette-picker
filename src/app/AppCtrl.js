var namespace = require('./namespace.js');

//Models
require('./models/SvgDocument.js');
require('./models/Color.js');

//Views
require('./svg-view/svgView.js');

/**
 * @constructor AppCtrl
 * Main controller for the application. Acts as the mediator between the various views
 */
namespace.classy.controller({
	name : 'AppCtrl',
	inject : ['$scope', '$http'],
	templateUrl : 'app/app.tpl.html',
	init : function(){
		var $scope = this.$scope;
		this.$http.get('/sample_data/Wien_3_Wappen.svg').then(function(response){
			$scope.document = {
				svg : response.data
			};
		});
	}
});