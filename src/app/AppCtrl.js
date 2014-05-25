var namespace = require('./namespace.js'),
	_ = require('lodash');

//Models
require('./models/SvgDocument.js');
require('./models/Color.js');
require('./models/Palette.js');

//Views
require('./svg-view/svgView.js');
require('./document-selector/documentSelector.js');
require('./color-selector/colorSelector.js');

/**
 * @constructor AppCtrl
 * Main controller for the application. Acts as the mediator between the various views
 */
namespace.classy.controller({
	name : 'AppCtrl',
	inject : ['$scope', '$http', 'Palette', 'SvgDocument'],
	templateUrl : 'app/app.tpl.html',
	init : function(){
		var $scope = this.$scope;
		var SvgDocument = this.SvgDocument;

		//Simplistic way of tracking which is the latest svg file loaded
		this.svgChangeCount = 0;

		SvgDocument.query().$promise.then(function(documents){
			$scope.documents = documents;
			if(documents.length){
				$scope.activeDocument = documents[0];
			}
		});
	},
	watch : {
		'activeDocument' : function(activeDocument){
			var _this = this;
			var $http = this.$http;
			var svgCount = ++this.svgChangeCount;
			var $scope = this.$scope;
			var Palette = this.Palette;

			if(activeDocument){
				$http.get(activeDocument.svgUrl).then(function(response){
					if(svgCount != _this.svgChangeCount){
						return;
					}
					$scope.activeSvg = response.data;
					$scope.palette = new Palette(activeDocument.palette);
				});
			} else {
				$scope.activeSvg = null;
				$scope.palette = null;
			}
		}
	},
	onDocumentSave : function() {
		var $scope = this.$scope;
		var activeDocument = $scope.activeDocument;
		activeDocument.palette = $scope.palette.toJSON();
		activeDocument.$save();
	},
	onDocumentExport : function() {
		//TODO use XMLSerializer to create a file, use window.URL.createObjURL to create a download link
	}
});