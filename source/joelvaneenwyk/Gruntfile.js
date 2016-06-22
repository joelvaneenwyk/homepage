/* jshint node: true */

"use strict";

module.exports = function(grunt) {

    var path = require('path');
    var root = path.join(process.cwd());
    var thirdparty = path.join(root, 'thirdparty');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        processhtml: {
            options: {
                process: true,
                recursive: true,
                data: {
                    title: 'Joel Van Eenwyk',
                    message: 'This is production distribution'
                }
            },
            dist: {
                files: {
                    'dist/staging/index.html': ['source/joelvaneenwyk/data/index.html']
                }
            },
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['www/js/*.js', path.join(thirdparty, '/bootstrap-3.3.4/dist/js/bootstrap.js')],
                dest: 'dist/staging/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/release/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'www/js/main.js'],
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
        harp: {
            dist: {
                source: path.join(root, 'views'),
                dest: 'dist/staging/'
            }
        },
        clean: {
            options: {
                'force': true
            },
            build: ['dist/release', 'dist/staging']
        },
        jsbeautifier: {
            files: ["dist/staging/*.html", "dist/staging/**/*.html"],
            options: {
                //config: "path/to/configFile",
                html: {
                    braceStyle: "collapse",
                    indentChar: " ",
                    indentScripts: "keep",
                    indentSize: 4,
                    maxPreserveNewlines: 0,
                    preserveNewlines: true,
                    unformatted: ["a", "sub", "sup", "b", "i", "u"],
                    wrapLineLength: 0
                },
                css: {
                    indentChar: " ",
                    indentSize: 4
                },
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0,
                    endWithNewline: true
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'www',
                    src: '*.html',
                    dest: 'dist/staging/'
                }, {
                    expand: true,
                    cwd: 'www',
                    src: '*.png',
                    dest: 'dist/staging/images'
                }, {
                    expand: true,
                    cwd: 'www',
                    src: '*.ico',
                    dest: 'dist/staging'
                }]
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-harp');

    grunt.registerTask('default', ['harp', 'jsbeautifier', 'jshint', 'concat', 'uglify', 'copy']);
};
