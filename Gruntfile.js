module.exports = function(grunt) {

    //
    // #todo #jve Look into the following:
    //  http://stackoverflow.com/questions/12401998/have-grunt-generate-index-html-for-different-setups
    //  https://www.npmjs.com/package/grunt-targethtml
    //  https://github.com/jsoverson/grunt-preprocess
    // * Create a dist/release and dist/dev and watch should be used for dist/dev
    // * dist/dev should NOT use the min version
    // * Add d3 (e.g. http://mbostock.github.io/d3/talk/20111018/collision.html)
    //

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
                    'dist/staging/index.html': ['source/site/index.html']
                }
            },
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['source/site/js/*.js', 'thirdparty/bootstrap-3.3.4/dist/js/bootstrap.js'],
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
            files: ['Gruntfile.js', 'source/site/js/main.js'],
            options: {
                // options here to override JSHint defaults
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
            build: ['dist/release', 'dist/staging']
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'source/site/',
                    src: '*.html',
                    dest: 'dist/staging/'
                }, {
                    expand: true,
                    cwd: 'source/site/',
                    src: '*.png',
                    dest: 'dist/staging/images'
                }, {
                    expand: true,
                    cwd: 'source/site',
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

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('heroku', ['jshint', 'concat', 'uglify']);
};