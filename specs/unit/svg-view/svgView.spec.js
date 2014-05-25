describe('svgView', function(){
	beforeEach(module('svg-palette-picker'));

	function createDirective($injector) {
		return $injector.invoke(function($compile, $rootScope){
			var directive = $compile('<svg-view palette="palette" svg="svg"></svg-view>')($rootScope);
			var scope = directive.isolateScope();
			var controller = directive.controller();
			return {
				scope : scope,
				directive : directive,
				controller : controller
			}
		});
	}

	it('should broadcast an event on rootscope when palette updates', inject(function($injector, $rootScope, Palette, Color){
		$rootScope.palette = new Palette();
		var testObjs = createDirective($injector);
		$rootScope.$digest();

		var eventSpy = jasmine.createSpy('eventSpy');
		testObjs.scope.$new().$on('updateColor', eventSpy);

		$rootScope.palette.addColors(['#000000', '#ff0000']);

		var mostRecentArgs = eventSpy.calls.mostRecent().args;

		expect(JSON.stringify(mostRecentArgs[1])).toEqual(JSON.stringify({
			'#000000' : new Color('#000000'),
			'#ff0000' : new Color('#ff0000')
		}));
	}));
});