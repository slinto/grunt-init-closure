'use strict';
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',

    less: {
      dev: {
        files: {
          'www/assets/css/style.css': 'www/assets/css/index.less'
        }
      },
      production: {
        options: {
          cleancss: true,
          report: 'gzip'
        },
        files: {
          'www/assets/css/style.css': 'www/assets/css/index.less'
        }
      }
    },

    /**
     * Production builded && closure compiler
     */
    closureBuilder: {
      options: {
        closureLibraryPath: 'www/bower_components/closure-library',
        namespaces: '<%= pkg.namespace %>',
        compilerFile: 'www/bower_components/closure-compiler/compiler.jar',
        compile: true,
        compilerOpts: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          define: ["'goog.DEBUG=false'"],
          summary_detail_level: 3,
          warning_level: 'VERBOSE',
          jscomp_error: 'accessControls',
          //debug: "true",
          //formatting: "PRETTY_PRINT"
        },

        execOpts: {
          maxBuffer: 999999 * 1024
        },
      },
      targetName: {
        src: ['www/bower_components/closure-library', 'www/assets/js'],
        dest: 'www/assets/app-prod.js'
      }
    },

    /**
     * Generating a dependency file with depswriter.py
     */
    closureDepsWriter: {
      options: {
        closureLibraryPath: 'www/bower_components/closure-library',
        root_with_prefix: '"www/assets/js/ ../../../../assets/js"',
      },
      targetName: {
        dest: 'www/assets/app-deps.js',
      }
    },

    gjslint: {
      options: {
        flags: [
          '--disable 110'
        ],
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: ['www/assets/js/**/*.js']
      }
    },

    clean: {
      build: ['dist/']
    },

    copy: {
      main: {
        expand: true,
        cwd: 'www/',
        src: ['assets/**', 'assets/app-prod.js', '*.html'],
        dest: 'dist'
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      src: {
        files: ['www/assets/js/**/*.js', 'www/assets/css/**/*.less', 'www/*.html', 'Gruntfile.js'],
        tasks: ['default'],
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'www',
          open: true
        }
      }
    }
  });

  require('jit-grunt')(grunt, {
    closureDepsWriter: 'grunt-closure-tools',
    closureBuilder: 'grunt-closure-tools'
  });

  // Grunt tasks
  grunt.registerTask('default', ['less:dev', 'gjslint', 'closureDepsWriter']);
  grunt.registerTask('build', ['less:production', 'gjslint', 'closureBuilder', 'clean', 'copy']);
  grunt.registerTask('server', ['default','connect', 'watch']);
};
