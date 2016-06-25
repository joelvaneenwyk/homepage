/* jshint node: true */

"use strict";

module.exports = function(grunt) {

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
        jsonlint: {
            files: ['*']
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

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadTasks('./source/joelvaneenwyk');

    grunt.registerTask('default', ['jshint', 'joelvaneenwyk-dev']);
    grunt.registerTask('dist', ['jshint', 'joelvaneenwyk']);
    grunt.registerTask('clean', ['clean']);
    grunt.registerTask('watch', ['watch']);
};
