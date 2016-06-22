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
        run_grunt: {
            options: {
                minimumFiles: 1
            },
            default: {
                options: {
                    log: true,
                    process: function(res){
                        if (res.fail){
                            res.output = 'new content';
                            grunt.log.writeln('bork bork');
                        }
                    }
                },
                src: ['source/joelvaneenwyk/Gruntfile.js']
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-run-grunt');

    grunt.registerTask('default', ['jshint', 'run_grunt']);
    grunt.registerTask('watch', ['watch']);
};
