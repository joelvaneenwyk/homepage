/* jshint node: true */

"use strict";

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var path = require('path');

    // This is a bit of a hack due to the Harp plugin not handling paths like
    // everyone else. We need to ensure that the path points at the right place
    // regardless of where you run the Gruntfile from
    var currentDir = process.cwd() + '/';
    if (!grunt.file.isDir(currentDir + '/views'))
        currentDir = 'source/joelvaneenwyk/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
            all: ["dist/temp/**/*.html"]
        },
        bootlint: {
            options: {
                stoponerror: false,
                relaxerror: []
            },
            files: ["dist/temp/**/*.html"]
        },
        uglify: {
            options: {
                banner: '/*! joelvaneenwyk <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/staging/js/main.min.js': currentDir + 'www/js/main.js',
                    'dist/staging/js/preload.min.js': currentDir + 'www/js/preload.js',
                    'dist/staging/js/login.min.js': currentDir + 'www/js/login.js',
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
                dest: 'dist/temp/'
            }
        },
        clean: {
            options: {
                'force': true
            },
            build: ['dist']
        },
        jsbeautifier: {
            files: ["dist/staging/**/*.html"],
            options: {
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
            dist: {
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
            bower: {
                files: [{
                    expand: true,
                    cwd: 'bower_components',
                    src: ['**/bower.json', '**/.bower.json'],
                    dest: 'dist/staging/thirdparty'
                }]
            },
        },
        bower: {
            install: {
                options: {
                    targetDir: 'dist/staging/thirdparty',
                    cleanTargetDir: true,
                    install: false,
                    copy: true,
                    prune: false,
                    cleanBowerDir: false
                }
            }
        },
        bower_main: {
            copy: {
                options: {
                    method: "copy",
                    dest: 'dist/staging/thirdparty'
                }
            }
        },
        wiredep: {
            internal: {
                src: [
                    currentDir + 'views/**/*.scss'
                ]
            },
            external: {
                directory: 'dist/staging/thirdparty',
                exclude: [/joelvaneenwyk/],
                src: [
                    currentDir + 'views/**/*.ejs'
                ]
            }
        },
        csslint: {
            options: {},
            lax: {
                options: {
                    important: false,
                    'adjoining-classes': false
                },
                src: ['dist/temp/**/*.css']
            }
        },
        replace: {
            dist: {
                files: [{
                    expand: true,
                    src: currentDir + 'views/**/*.ejs',
                    dest: ''
                }],
                options: {
                    patterns: [{
                        match: /<script src="(.*?)">/ig,
                        replacement: function(match, offset, str, source, target) {
                            var targetRoot = process.cwd() + '/' + path.dirname(target);
                            var to = path.resolve(targetRoot + '/' + offset);
                            if (grunt.file.exists(to)) {
                                var from = process.cwd() + '/dist/staging';
                                var rel = path.relative(from, to);
                                rel = rel.replace(/\\/g, '/');
                                var result = '<script src="/' + rel + '">';
                                return result;
                            }
                            return match;
                        }
                    }, {
                        match: /<link rel="stylesheet" href="(.*?)" /ig,
                        replacement: function(match, offset, str, source, target) {
                            var targetRoot = process.cwd() + '/' + path.dirname(target);
                            var to = path.resolve(targetRoot + '/' + offset);
                            if (grunt.file.exists(to)) {
                                var from = process.cwd() + '/dist/staging';
                                var rel = path.relative(from, to);
                                rel = rel.replace(/\\/g, '/');
                                var result = '<link rel="stylesheet" href="/' + rel + '" ';
                                return result;
                            }
                            return match;
                        }
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-harp');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bower-main');
    grunt.loadNpmTasks('grunt-wiredep');

    var devTasks = ['csslint', 'jshint', 'htmllint', 'bootlint'];
    var requiredTasks = [
        'bower_main', 'copy',
        'wiredep:internal', 'wiredep:external',
        'harp', 'replace',
        'jsbeautifier', 'uglify', 'imagemin'
    ];

    grunt.registerTask('default', requiredTasks.concat(devTasks));
    grunt.registerTask('joelvaneenwyk', requiredTasks.concat('copy'));
    grunt.registerTask('joelvaneenwyk-dev', requiredTasks.concat(devTasks).concat('copy'));
};
