var grunt = require("grunt");

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-release');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-istanbul');
grunt.loadNpmTasks('grunt-browserify');

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
	instrument: {
		files: ['src/**/*.js','tests/**/*.js'],
		options: {
			lazy: false,
			basePath: '.coverage'
		}
	},
	jshint: {
		all: ['src/**/*.js', '*.js', 'tests/**/*.js'],
		options:{
			esnext:true
		}
	},
	mochaTest: {
		test: {
			options: {
				reporter: 'spec',
				clearRequireCache:true
			},
			src: ['tests/**/*.js']
		},
		cov: {
			options: {
				reporter: 'spec',
				clearRequireCache:true
			},
			src: ['.coverage/tests/**/*.js']
		}
	},
	storeCoverage: {
		options: {
			dir: '.coverage/reports'
		}
	},
	makeReport: {
		src: '.coverage/reports/**/*.json',
		options: {
			type: 'html',
			dir: '.coverage/reports',
			print: 'both'
		}
	},
	release: {
		options: {
			bump: true,
			npm: true,
			npmTag: "<%= version %>"
		}
	},
	exec: {
		express: 'node --debug examples/hello-express/index.js'
	},
	browserify: {
	  dist: {
	    files: {
	      'browser/studio-with-dependecies.js': ['src/**/*.js']
	    }
	  }
	}
});

grunt.registerTask("cov-test", [ "instrument","mochaTest:cov", 'storeCoverage','makeReport']);
grunt.registerTask("test", ["mochaTest:test"]);
grunt.registerTask("coverage", ["jshint","cov-test"]);
grunt.registerTask("all", ["jshint", "test"]);
grunt.registerTask("default", ["all", "watch"]);
grunt.registerTask("prod", ["all", "release"]);

grunt.registerTask("example:express", 'exec:express');
