/* jshint node: true */

"use strict";

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        watch: {
            scripts: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:all'],
                options: {
                    debounceDelay: 250,
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        clean: {
            files: ['dist']
        }
    });

    grunt.loadTasks('./source/joelvaneenwyk');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'joelvaneenwyk-dev']);
    grunt.registerTask('dist', ['jshint', 'joelvaneenwyk']);
};
