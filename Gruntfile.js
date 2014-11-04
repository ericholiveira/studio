var grunt = require("grunt");
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-coffeelint');
grunt.loadNpmTasks('grunt-contrib-coffee');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-codo');
grunt.loadNpmTasks('grunt-contrib-jasmine');
grunt.loadNpmTasks('grunt-browserify');

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
        sourceMapDir: 'target/maps/'
      },
      expand: true,
      cwd: 'src',
      src: '**/*.coffee',
      dest: 'target/',
      ext: '.js'
    }
  },
  copy: {
    js: {
      expand: true,
      cwd: 'src/',
      src: '**/*.js',
      dest: 'target/'
    }
  },
  codo: {
    all: {
      src: ['src/**/*.coffee'],
      dest: 'docs/'
    }
  },
  jasmine: {
    src: ['tests/target/broadway-core-with-tests.js']
  },
  browserify: {
    dist: {
      files: {
        'dist/broadway-core.js': ['target/core/broadway.js']
      }
    },
    testCore: {
      files: {
        'tests/target/broadway-core-with-tests.js': ['tests/core/*.js']
      }
    }
  }

});

grunt.registerTask("all", ["all-coffee", "all-js", "browserify:testCore",
  "jasmine"
]);
grunt.registerTask("all-js", ["jshint:all", "copy:js"]);
grunt.registerTask("all-coffee", ["coffeelint", "coffee:multiple"]);
grunt.registerTask("default", ["all", "watch"]);
grunt.registerTask("doc", ["codo:all"]);
grunt.registerTask("release", ["all", "codo:all", "browserify:dist"]);