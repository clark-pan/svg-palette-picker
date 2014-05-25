describe('Palette', function(){
	beforeEach(module('svg-palette-picker'));
	it('should be fire an event when a model changes', inject(function(Palette, Color){
		var color = new Color('#000000')
		var Palette = new Palette([
			color
		]);

		var eventSpy = jasmine.createSpy('eventSpy');
		Palette.on('update', eventSpy);

		color.setColor('#ff0000');

		expect(eventSpy.calls.mostRecent().args).toEqual([{
			'#000000' : color
		}]);
	}));

	it('should fire an event with all changed models when batch updating', inject(function(Palette, Color){
		var _ = require('lodash');
		var Palette = new Palette();

		var eventSpy = jasmine.createSpy('eventSpy');
		Palette.on('update', eventSpy);

		Palette.addColors(['#000000', '#ff0000', '#00ff00']);

		var mostRecentArgs = eventSpy.calls.mostRecent().args;

		expect(JSON.stringify(mostRecentArgs)).toEqual(JSON.stringify([
			{
				'#000000' : new Color('#000000'),
				'#ff0000' : new Color('#ff0000'),
				'#00ff00' : new Color('#00ff00')
			}
		]));
	}));
})