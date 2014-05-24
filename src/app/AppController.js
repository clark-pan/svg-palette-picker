var namespace = require('./namespace.js');

require('./models/SvgDocument.js');
require('./models/Color.js');

namespace.classy.controller({
	name : 'AppCtrl',
	inject : ['$scope'],
	templateUrl : 'app/app.tpl.html',
	init : function(){
		
	}
});