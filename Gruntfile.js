var grunt = require("grunt");
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
      files: ['src/**/*.js', '*.js', 'src/**/*.coffee', '*.coffee'],
      tasks: ['all'],
      options: {
        spawn: false
      }
    }
  },
  jshint: {
    all: ['src/**/*.js', '*.js']
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
  }
});
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-coffeelint');
grunt.loadNpmTasks('grunt-contrib-coffee');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.registerTask("all", ["all-js", "all-coffee"]);
grunt.registerTask("all-js", ["jshint:all", "copy:js"]);
grunt.registerTask("all-coffee", ["coffeelint", "coffee:multiple"]);
grunt.registerTask("default", ["all", "watch"]);