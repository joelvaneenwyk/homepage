/* jshint node: true */

"use strict";

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        joelvaneenwyk: {},
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
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        clean: {
            options: {
                'force': true
            },
            build: ['dist']
        }
    });

    grunt.loadTasks('./source/joelvaneenwyk');

    grunt.registerTask('default', ['jshint', 'joelvaneenwyk-dev']);
    grunt.registerTask('dist', ['jshint', 'joelvaneenwyk']);
    grunt.registerTask('clean', ['clean']);
    grunt.registerTask('watch', ['watch']);
};
