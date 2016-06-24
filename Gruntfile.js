/* jshint node: true */

"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        joelvaneenwyk: {
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
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'run_grunt']
        },
        clean: {
            options: {
                'force': true
            },
            build: ['dist']
        },
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadTasks('./source/joelvaneenwyk');

    grunt.registerTask('default', ['jshint', 'joelvaneenwyk-dev']);
    grunt.registerTask('dist', ['jshint', 'joelvaneenwyk']);
    grunt.registerTask('clean', ['clean']);
    grunt.registerTask('watch', ['watch']);
};
