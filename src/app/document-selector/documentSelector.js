var namespace = require('../namespace.js'),
	_ = require('lodash');

namespace.classy.controller({
	name : 'DocumentSelectorCtrl',
	inject : ['$scope'],
	onDocumentClick : function(document){
		this.$scope.activeDocument = document;
	}
});

namespace.directive('documentSelector', [
	function(){
		return {
			restrict: "E",
			controller: 'DocumentSelectorCtrl as ctrl',
			scope : {
				'documents' : '=',
				'activeDocument' : '=',
				'downloadUri': '=',
				'onDocumentSave' : '&',
				'onDocumentExport' : '&'
			},
			templateUrl : 'app/document-selector/documentSelector.tpl.html',
			replace : true
		};
	}
]);