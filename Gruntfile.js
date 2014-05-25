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
		'copy' : {
			'sample' : {
				'files' : [
					{
						'expand' : true,
						'cwd' : './sample_data',
						'src' : ['**/*'],
						'dest' : './deploy/data'
					}
				]
			}
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
						//'debug' : true
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
				'tasks' : ['jshint:app', 'browserify:app']
			},
			'index' : {
				'files' : 'src/index.html',
				'tasks' : ['index']
			},
			'karma' : {
				'files' : buildVars.karmaFiles,
				'tasks' : ['karma:unit:run']
			},
			'compass' : {
				'files' : 'src/sass/**/*.scss',
				'tasks' : ['compass:dev']
			}
		},
		'jshint' : {
			'app' : {
				'src' : 'src/app/**/*.js'
			}
		},
		'connect' : {
			'options' : {
				'port' : 3000,
				'hostname' : '*',
				'base' : './deploy',
				'middleware' : function(connect, options, middlewares) {
					var fs = require('fs');
					var q = require('q');
					qReadDir = q.denodeify(fs.readdir);
					qReadFile = q.denodeify(fs.readFile);
					qWriteFile = q.denodeify(fs.writeFile);

					var rest = require('connect-rest');

					function getAsJSON(path){
						return qReadFile(path, {
							encoding : 'utf8'
						}).then(function(contents){
							return JSON.parse(contents);
						});
					}

					rest.get('/data/documents', function(req, content, next){
						qReadDir('./deploy/data/documents').then(function(paths){
							var paths = _.chain(paths)
								.map(function(path){
									return getAsJSON('./deploy/data/documents/' + path);
								})
								.value();
							return q.all(paths);
						}).then(function(documents){
							next(null, documents);
						}, function(rejection){
							next(rejection)
						});
					});

					rest.get('/data/documents/:id', function(req, content, next){
						if(!req.parameters.id) next();
						getAsJSON('./deploy/data/documents/' + req.parameters.id + '.json')
							.then(function(document){
								next(null, document);
							}, function(rejection){
								next(rejection);
							});
					});

					rest.post('/data/documents/:id', function(req, content, next){
						if(!req.parameters.id) next();
						qWriteFile('./deploy/data/documents/' + req.parameters.id + '.json', JSON.stringify(content))
							.then(function(){
								next(null, content);
							}, function(rejection){
								next(rejection);
							});
					});

					middlewares = [connect.query(), connect.urlencoded(), connect.json(), rest.rester()].concat(middlewares);

					return middlewares;
				}
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
				'background': true
			},
			'continuous' : {
				'singleRun': true
			}
		},
		'compass' : {
			'options' : {
				'config' : 'build/compass.rb'
			},
			'dev' : {
				'environment' : 'development'
			},
			'package' : {
				'environment' : 'production'
			}
		},
		'shell' : {
			'bootstrap-font': {
				'command' : 'mkdir -p deploy/static/fonts && cp -r $(bundle show bootstrap-sass)/vendor/assets/fonts/ deploy/static/fonts'
			}
		}
	});

	grunt.registerTask('index', "compiles index.html", function(){
		var process = _.compose(
				_.bind(grunt.file.write, grunt.file, './deploy/index.html'),
				_.partialRight(_.bind(grunt.template.process, grunt.template), {
					data : {
						jsFiles : ['app/vendor.js', 'app/templates.js', 'app/app.js'],
						cssFiles : ['static/css/index.css']
					}
				}),
				_.bind(grunt.file.read, grunt.file, './src/index.html')
			);
		process();
	});

	grunt.registerTask('default', ['dev']);
	grunt.registerTask('dev', ['clean', 'jshint:app', 'copy:sample', 'shell:bootstrap-font', 'index', 'html2js:app', 'browserify', 'compass:dev', 'karma:unit:start', 'connect:dev', 'watch']);
}