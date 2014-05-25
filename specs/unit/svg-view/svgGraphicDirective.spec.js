describe('svgGraphicDirective', function(){
	var _ = require('lodash');
	beforeEach(module('svg-palette-picker'));

	function createDirective($injector) {
		return $injector.invoke(function($compile, $rootScope){
			$rootScope.svg = '<circle fill="#000000" stroke="#ff0000"></circle>';
			var compiled = $compile('<svg-view palette="palette" svg="svg"></svg-view>')($rootScope);
			$rootScope.$digest();
			var directive = compiled.find('circle');
			var scope = directive.isolateScope();
			return {
				scope : scope,
				directive : directive,
				parentDirective : compiled
			}
		});
	}

	//TODO skip for now, phantomJS doesn't support parsing SVG nodes from DOMParser
	xit('should update its fill/stroke colors when an event is broadcasted', inject(function($injector, $rootScope, Palette){
		$rootScope.palette = new Palette(['#000000', '#ff0000']);
		var testObjs = createDirective($injector);

		$rootScope.palette.addColors([{
			id : '#000000',
			color : '#00ff00'
		},
		{
			id : '#ff0000',
			color : '#0000ff'
		}
		]);
		$rootScope.$digest();

		expect(testObjs.directive[0].getAttribute('fill')).toBe('#00ff00');
		expect(testObjs.directive[0].getAttribute('stroke')).toBe('#0000ff');
	}));
});