module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jasmine: {
      all: {
        // PhantomJS is not fully ES5-compatible; shim it
        src: [
          'bower_components/es5-shim/es5-shim.js'
        ],
        options: {
          specs: 'test/unit/**/*.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: 'test/boot.js',
            requireConfig: {
              baseUrl: '.'
            }
          },
          keepRunner: true
        }
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  grunt.registerTask('test', 'generates runner and runs the tests', ['jasmine']);

};
