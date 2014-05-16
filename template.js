/*
 * grunt-init-closure
 * https://gruntjs.com/
 *
 * Copyright (c) 2014 Slinto - Tomas Stankovic
 * info@slinto.sk
 * @TomasStankovic
 * Licensed under the MIT license.
 */

'use strict';

exports.description = 'Create a new WebApp including Google Closure Tools.';

exports.notes = 'HELLO! Let\'s build better internet! \nThis is WebApp template ' +
  'including Google Closure Tools and LESS with LESSHAT2 mixins.';

exports.after = 'Done! \nHappy Coding!';
exports.warnOn = '*';

exports.template = function(grunt, init, done) {

  init.process({
    type: 'closure'
  }, [
    init.prompt('name'), {
      name: 'namespace',
      message: 'Project namespace',
      default: 'slinto.project',
      validator: /^[\w\-\.\_]+$/,
      warning: 'Must be only letters, numbers, dashes, dots or underscores.'
    },
    init.prompt('description'),
    init.prompt('version', '0.0.1'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url')
  ], function(err, props) {
    props.keywords = [];
    var files = init.filesToCopy(props);
    init.addLicenseFiles(files, props.licenses);
    init.copyAndProcess(files, props, {
      noProcess: 'www/assets/**'
    });

    var namespace = props.namespace,
      pkg = {
        name: props.name,
        namespace: namespace,
        version: props.version,
        node_version: '>= 0.10.0',
        devDependencies: {
          'grunt': '~0.4.2',
          'jit-grunt': '~0.2.0',
          'grunt-gjslint': '~0.1.4',
          'grunt-contrib-less': '~0.9.0',
          'grunt-contrib-copy': '~0.5.0',
          'grunt-contrib-watch': '~0.5.3',
          'grunt-closure-tools': '~0.9.2',
          'grunt-contrib-clean': '~0.5.0',
          'grunt-contrib-connect': '~0.6.0'
        }
      }

    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', pkg, function(pkg, props) {
      pkg.namespace = namespace;
      return pkg;
    });

    // Generate bower.json file, used by bower.
    init.writePackageJSON('bower.json', {
      name: props.name,
      version: props.version,
      dependencies: {
        'lesshat': 'https://github.com/csshat/lesshat.git',
        'closure-compiler': 'http://dl.google.com/closure-compiler/compiler-latest.zip',
        'closure-library': 'git+https://github.com/google/closure-library/'
      }
    });

    // All done!
    done();
  });

};
