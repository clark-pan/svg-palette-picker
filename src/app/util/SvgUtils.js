var SvgUtils = {
	SVG_DEFAULTS : {
		fill : '#000000',
		stroke : '#000000'
	},
	/**
	 * Encapsulates the logic of finding a color to key on for an element
	 * 
	 * @param  {Element} rawElement - element to search on
	 * @param  {'fill' | 'stroke'} property - color property to find
	 * @return {String | falsy}
	 */
	getColorKey : function(rawElement, property){
		var style = rawElement.style;

		return style[property] || //Style overrides attribute
			rawElement.getAttribute(property) ||
			(rawElement.nodeName === 'svg' && SvgUtils.SVG_DEFAULTS[property]); //We use the fill and stroke properties of the root svg elements to define the defaults
	},
	parseSvg : function(svgString){
		try {
			//TODO figure out some fallbacks for ie and whatnot
			var parser = new window.DOMParser();
			compiled = parser.parseFromString(svgString, 'image/svg+xml');
			if( !compiled || compiled.getElementsByTagName( "parsererror").length || compiled.documentElement.tagName !== 'svg') {
				compiled = undefined;
			}
		} catch (e){
			compiled = undefined;
		}
		return compiled;
	}
};

module.exports = SvgUtils;