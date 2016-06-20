module.exports = function(grunt) {

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
                src: ['source/joelvaneenwyk/data/js/*.js', 'thirdparty/bootstrap-3.3.4/dist/js/bootstrap.js'],
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
            all: ['Gruntfile.js', 'source/joelvaneenwyk/data/js/main.js'],
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
                source: 'views/',
                dest: 'dist/staging/'
            }
        },
        clean: {
            options: {
                'force': true
            },
            build: ['dist/release', 'dist/staging']
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'source/joelvaneenwyk/data/',
                    src: '*.html',
                    dest: 'dist/staging/'
                }, {
                    expand: true,
                    cwd: 'source/joelvaneenwyk/data/',
                    src: '*.png',
                    dest: 'dist/staging/images'
                }, {
                    expand: true,
                    cwd: 'source/joelvaneenwyk/data',
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
    grunt.loadNpmTasks('grunt-harp');

    grunt.registerTask('default', ['harp', 'jshint', 'concat', 'uglify', 'copy']);
    grunt.registerTask('heroku', ['jshint', 'concat', 'uglify']);
};
