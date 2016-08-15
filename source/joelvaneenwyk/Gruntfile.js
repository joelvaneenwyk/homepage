/* jshint node: true */

"use strict";

module.exports = function(grunt) {

    // This is done automatically by Heroku but needs to be done
    // manually if we are debugging through Visual Studio.
    if (process.env.PG_REMOTE_URL === undefined) {
        console.log('Manually loading environment...');
        require('dotenv').config();
    }

    var path = require('path');

    // This is a bit of a hack due to the Harp plugin not handling paths like
    // everyone else. We need to ensure that the path points at the right place
    // regardless of where you run the Gruntfile from
    var currentDir = process.cwd() + '/';
    if (!grunt.file.isDir(currentDir + '/views'))
        currentDir = 'source/joelvaneenwyk/';

    grunt.registerMultiTask('update_globals', 'Update the globals', function() {
        var arrFilesSrc = this.filesSrc;

        arrFilesSrc.forEach(function(file) {
            var version = process.env.HEROKU_RELEASE_VERSION;

            var created_date = new Date(process.env.HEROKU_RELEASE_CREATED_AT);
            var month = created_date.getUTCMonth() + 1;
            var day = created_date.getUTCDate();
            var year = created_date.getUTCFullYear();
            var date = year + "-" + month + "-" + day;

            var p = grunt.file.readJSON('package.json');
            var f = grunt.file.readJSON(file);
            grunt.log.writeln("%j", f);
            f.globals.version = version;
            f.globals.created = date;
            f.globals.owner = p.author.name;
            f.globals.footer = "© Copyright 2016 " + f.globals.owner + " " + f.globals.version;
            if (process.env.NODE_ENV !== "production")
                f.globals.footer += " [" + f.globals.created + "]";
            grunt.log.writeln("%j", f);
            grunt.log.writeln('This is the success message');
            grunt.file.write(file, JSON.stringify(f));
        });
    });

    grunt.initConfig({
        watch: {
            scripts: {
                files: [currentDir + 'server/**/*.js'],
                tasks: ['jshint:all'],
                options: {
                    debounceDelay: 250,
                }
            },
            ejs: {
                files: [currentDir + 'views/**/*.ejs'],
                tasks: ['jshint:all'],
                options: {
                    debounceDelay: 250,
                }
            }
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
            all: ["dist/www/**/*.html"]
        },
        bootlint: {
            options: {
                stoponerror: false,
                relaxerror: []
            },
            files: ["dist/www/**/*.html"]
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: 'www/**/*.html',
                    dest: 'dist/'
                }, {
                    expand: true,
                    cwd: 'dist/',
                    src: 'staging/**/*.html',
                    dest: 'dist/'
                }]
            },
        },
        uglify: {
            options: {
                banner: '/*! joelvaneenwyk <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/staging/js/login.min.js': currentDir + 'www/js/login.js',
                }
            }
        },
        useminPrepare: {
            html: 'dist/www/**/*.html',
            options: {
                dest: 'dist/staging',
                staging: 'dist/_temp',
                root: 'dist/staging'
            }
        },
        usemin: {
            html: 'dist/www/**/*.html',
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
        harp: {
            dist: {
                source: 'dist/views/',
                dest: 'dist/www/'
            }
        },
        update_globals: {
            all: ['dist/views/_harp.json']
        },
        clean: {
            options: {
                'force': true
            },
            build: [currentDir + 'dist']
        },
        jsbeautifier: {
            files: ['dist/staging/**/*.html', 'dist/www/**/*.html'],
            options: {
                html: {
                    braceStyle: "collapse",
                    indentChar: " ",
                    indentScripts: "keep",
                    indentSize: 4,
                    maxPreserveNewlines: 0,
                    preserveNewlines: true,
                    unformatted: ["a", "sub", "sup", "b", "i", "u", "pre", "code"],
                    wrapLineLength: 0,
                    endWithNewline: true
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
            css: {
                files: [{
                    expand: true,
                    cwd: 'dist/www/public/css',
                    src: '*.css',
                    dest: 'dist/staging/css'
                }]
            },
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
            bower_pdfjs: {
                files: [{
                    expand: true,
                    cwd: 'bower_components',
                    src: ['pdfjs-dist/web/**', 'pdfjs-dist/cmaps/**'],
                    dest: 'dist/staging/thirdparty'
                }]
            },
            views: {
                cwd: currentDir + 'views',
                src: '**/*',
                dest: 'dist/views',
                expand: true
            },
            cssjs: {
                expand: true,
                cwd: 'dist/www/public',
                src: ['**/*.css', '**/*.js', '**/*.png'],
                dest: 'dist/www/static'
            }
        },
        preprocess: {
            all_from_dir: {
                src: '**/*.js',
                ext: '.js',
                cwd: 'dist/staging',
                dest: 'dist/staging',
                expand: true
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
                    'dist/views/**/*.scss'
                ]
            },
            external: {
                directory: 'dist/staging/thirdparty',
                exclude: [/joelvaneenwyk/, /bootstrap-sass/, /topojson/, /d3/, /datamaps/, /pdfjs/],
                src: [
                    'dist/views/**/*.ejs'
                ]
            }
        },
        concat: {
            dist: {
                src: ['dist/none'],
                dest: 'dist/_temp/empty.js'
            }
        },
        cssmin: {
            dist: {
                src: ['dist/none'],
                dest: 'dist/_temp/empty.css'
            }
        },
        csslint: {
            lax: {
                options: {
                    important: false,
                    'qualified-headings': false,
                    'adjoining-classes': false
                },
                src: ['dist/www/**/*.css']
            }
        },
        replace: {
            dist: {
                files: [{
                    expand: true,
                    src: 'dist/views/**/*.ejs',
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

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-harp');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-bower-main');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-preprocess');

    var requiredTasks = [
        'bower_main',
        'copy:dist', 'copy:bower', 'copy:bower_pdfjs', 'copy:views',
        'preprocess',
        'wiredep:internal', 'wiredep:external',
        'replace', 'update_globals', 'harp', 'copy:css', 'copy:cssjs',
        // Need to bootlint before 'usemin' because it combines dependencies and
        // makes bootlint think we aren't using jquery
        'bootlint',
        'useminPrepare', 'concat', 'uglify', 'cssmin', 'imagemin',
        'usemin', 'htmlmin', 'jsbeautifier',
    ];

    var postTasksValidate = ['csslint', 'jshint', 'htmllint'];

    grunt.registerTask('globals', ['update_globals']);
    grunt.registerTask('default', requiredTasks.concat(postTasksValidate));
    grunt.registerTask('update', ['copy:dist', 'copy:views', 'harp',
        'wiredep:internal', 'wiredep:external',
        'replace', 'update_globals', 'harp',
        'uglify', 'htmlmin', 'jsbeautifier'
    ]);
    grunt.registerTask('joelvaneenwyk', requiredTasks);
    grunt.registerTask('joelvaneenwyk-dev', requiredTasks.concat(postTasksValidate));
};
