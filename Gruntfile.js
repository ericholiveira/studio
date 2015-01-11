var grunt = require("grunt");
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-coffeelint');
grunt.loadNpmTasks('grunt-contrib-coffee');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-codo');
grunt.loadNpmTasks('grunt-contrib-jasmine');
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-release');
grunt.loadNpmTasks('grunt-jasmine-node');
grunt.loadNpmTasks('grunt-jasmine-node-coverage');

grunt.initConfig({
  coffeelint: {
    app: ['src/**/*.coffee', '*.coffee'],
    options: {
      'max_line_length': {
        level: 'ignore'
      }
    }
  },
  watch: {
    scripts: {
      files: ['src/**/*.{coffee,js}', '*.{coffee,js}',
        'tests/core/*.{coffee,js}'
      ],
      tasks: ['all'],
      options: {
        spawn: false
      }
    }
  },
  jshint: {
    all: ['src/**/*.js', '*.js', 'tests/core/*.js']
  },
  coffee: {
    multiple: {
      options: {
        sourceMap: true,
        sourceMapDir: 'compiled/maps/'
      },
      expand: true,
      cwd: 'src',
      src: '**/*.coffee',
      dest: 'compiled/',
      ext: '.js'
    }
  },
  copy: {
    js: {
      expand: true,
      cwd: 'src/',
      src: '**/*.js',
      dest: 'compiled/'
    }
  },
  codo: {
    all: {
      src: ['src/**/*.coffee'],
      dest: 'docs/'
    }
  },
  jasmine: {
    src: ['tests/target/studio-with-dependencies-with-tests.js']
  },
  browserify: {
    dist: {
      files: {
        'dist/studio-with-dependencies.js': ['compiled/core/studio.js']
      }
    },
    testCore: {
      files: {
        'tests/target/studio-with-dependencies-with-tests.js': [
          'tests/core/*.js'
        ]
      }
    }
  },
  release: {
    options: {
      bump: true,
      npm: true,
      npmTag: "<%= version %>"
    }
  },
  jasmine_node: {
    options: {
      coverage: {
        excludes: ['docs/**/*.js', 'coverage/**/*.js',
          'compiled/core/util/clone.js'
        ]
      },
      forceExit: true,
      match: '.',
      matchall: true,
      extensions: 'js',
      specNameMatcher: 'Test'
    },
    all: ['tests/']
  }

});
grunt.registerTask("test", ["jasmine"]);
grunt.registerTask("all", ["all-coffee", "all-js", "browserify:dist",
  "browserify:testCore", "test"
]);
grunt.registerTask("all-js", ["jshint:all", "copy:js"]);
grunt.registerTask("all-coffee", ["coffeelint", "coffee:multiple"]);
grunt.registerTask("default", ["all", "watch"]);
grunt.registerTask("doc", ["codo:all"]);
grunt.registerTask("prod", ["all", "browserify:dist", "jasmine_node", "release"]);