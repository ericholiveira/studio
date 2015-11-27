var grunt = require("grunt");
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-release');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-mocha-test');

grunt.initConfig({
	watch: {
		scripts: {
			files: ['src/**/*.js', '*.js', 'tests/*.js'
			],
			tasks: ['all'],
			options: {
				spawn: false
			}
		}
	},
	jshint: {
		all: ['src/**/*.js', '*.js', 'tests/*.js'],
		options:{
			esnext:true
		}
	},
	mochaTest: {
		test: {
			options: {
				reporter: 'spec'
			},
			src: ['tests/*.js']
		}
	},
	release: {
		options: {
			bump: true,
			npm: true,
			changelog: 'CHANGELOG.md',
			changelogText: '### <%= version %> - ' + grunt.template.today('yyyy-mm-dd') + '\n',
			npmTag: "<%= version %>"
		}
	},
	exec: {
		express: 'node --debug examples/hello-express/index.js',
		hapi: 'node --debug examples/hello-hapi/index.js',
		restify: 'node --debug examples/hello-restify/index.js',
		koa: 'node --harmony-generators --debug examples/hello-koa/index.js',
	}

});
grunt.registerTask("test", ["mochaTest"]);
grunt.registerTask("all", ["jshint", "test"]);
grunt.registerTask("default", ["all", "watch"]);
grunt.registerTask("prod", ["all", "release"]);

grunt.registerTask("example:express", 'exec:express');
grunt.registerTask("example:hapi", 'exec:hapi');
grunt.registerTask("example:restify", 'exec:restify');
grunt.registerTask("example:koa", 'exec:koa');
