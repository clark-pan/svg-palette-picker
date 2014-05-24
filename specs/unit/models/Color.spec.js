describe('Color', function(){
	beforeEach(module('svg-palette-picker'));
	it('should be keyed on the a normalized color value', inject(function(Color){
		var cssColor = new Color('rgb(256, 0, 0)');
		var rgbColor = new Color('#ff0000');

		expect(cssColor.id).toBe(rgbColor.id);
	}));
});