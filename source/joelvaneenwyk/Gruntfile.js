/* jshint node: true */

"use strict";

module.exports = function(grunt) {

    var path = require('path');
    var root = path.join(process.cwd());
    var thirdparty = path.join(root, 'thirdparty');

    // This is a bit of a hack due to the Harp plugin not handling paths like
    // everyone else. We need to ensure that the path points at the right place
    // regardless of where you run the Gruntfile from
    var currentDir = process.cwd() + '/';
    if (!grunt.file.isDir(currentDir + '/views'))
        currentDir = 'source/joelvaneenwyk/';

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
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: currentDir + 'www/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/staging/'
                }]
            }
        },
        htmllint: {
            all: ["dist/staging/*.html", "dist/staging/**/*.html"]
        },
        bootlint: {
            options: {
                stoponerror: false,
                relaxerror: []
            },
            files: ["dist/staging/*.html", "dist/staging/**/*.html"]
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [currentDir + 'www/js/main.js', currentDir + 'www/js/preload.js'],
                dest: 'dist/staging/js/joelvaneenwyk.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! joelvaneenwyk <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/release/js/joelvaneenwyk.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            all: ['**.js', currentDir + 'server/*.js'],
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
                source: currentDir + 'views/',
                dest: 'dist/staging/'
            }
        },
        clean: {
            options: {
                'force': true
            },
            build: ['dist']
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
                    cwd: currentDir + 'www',
                    src: '*.html',
                    dest: 'dist/staging/'
                }, {
                    expand: true,
                    cwd: currentDir + 'www/js',
                    src: '*.js',
                    dest: 'dist/staging/js/'
                }, {
                    expand: true,
                    cwd: currentDir + 'www',
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
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-harp');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-bootlint');

    var devTasks = ['jshint', 'htmllint', 'bootlint'];
    var requiredTasks = ['harp', 'jsbeautifier', 'concat', 'uglify', 'imagemin'];

    grunt.registerTask('default', requiredTasks.concat(devTasks));
    grunt.registerTask('joelvaneenwyk', requiredTasks.concat('copy'));
    grunt.registerTask('joelvaneenwyk-dev', requiredTasks.concat(devTasks).concat('copy'));
};
