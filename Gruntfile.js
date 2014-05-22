module.exports = function(grunt){
	var _ = require('lodash');
	require('load-grunt-tasks')(grunt);

	var pkg = require('./package.json');
	var buildVars = require('./build/build.json');
	var externalFiles = _.keys(pkg.browser);

	grunt.initConfig({
		'clean' : {
			'deploy' : './deploy'
		},
		'browserify': {
			'vendor' : {
				'src' : buildVars.vendor,
				'dest' : 'deploy/app/vendor.js',
				'options' : {
					'require' : externalFiles
				}
			},
			'app' : {
				'src' : buildVars.app,
				'dest' : 'deploy/app/app.js',
				'options' : {
					'external' : externalFiles,
					'bundleOptions' : {
						'debug' : true
					}
				}
			}
		},
		'html2js': {
			'app' : {
				'src' : 'src/app/**/*.tpl.html',
				'dest' : buildVars.template,
				'options' : {
					'module' : 'svg-palette-picker-templates',
					'singleModule' : true
				}
			}
		},
		'watch' : {
			'vendor' : {
				'files' : ['src/vendor/index.js', 'package.json'],
				'tasks' : ['browserify:vendor']
			},
			'templates' : {
				'files' : 'src/app/**/*.tpl.html',
				'tasks' : ['html2js:app', 'browserify:app']
			},
			'app' : {
				'files' : 'src/app/**/*.js',
				'tasks' : ['browserify:app']
			},
			'index' : {
				'files' : 'src/index.html',
				'tasks' : ['index']
			},
			'karma' : {
				'files' : buildVars.karmaFiles,
				'tasks' : ['karma:unit:run']
			}
		},
		'connect' : {
			'options' : {
				'port' : 3000,
				'hostname' : '*',
				'base' : './deploy'
			},
			'dev' : {
				'keepalive' : false
			}
		},
		'karma' : {
			'options' : {
				'configFile' : './specs/karma.conf.js'
			},
			'unit': {
				background: true
			},
			'continuous' : {
				'singleRun': true
			}
		}
	});

	grunt.registerTask('index', "compiles index.html", function(){
		var process = _.compose(
				_.bind(grunt.file.write, grunt.file, './deploy/index.html'),
				_.partialRight(_.bind(grunt.template.process, grunt.template), {
					data : {
						jsFiles : ['app/vendor.js', 'app/templates.js', 'app/app.js'],
						cssFiles : []
					}
				}),
				_.bind(grunt.file.read, grunt.file, './src/index.html')
			);
		process();
	});

	grunt.registerTask('default', ['dev']);
	grunt.registerTask('dev', ['clean', 'index', 'html2js:app', 'browserify', 'karma:unit:start', 'connect:dev', 'watch']);
}