module.exports = function(grunt) {

    // Load the all the plugins that Grunt requires
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        notify: {
            watch: {
                options: {
                    title: 'Watching…',
                    message: '…all the files'
                }
            },
            build: {
                options: {
                    title: 'Build',
                    message: 'All the files'
                }
            },
            sass: {
                options: {
                    title: 'CSS…',
                    message: 'Compiled all the things'
                }
            }
        },
        watch: {
            options: { nospawn: true },
            env: {
                // environment files and markup pages
                files: [
                    "Gruntfile.js",
                    "*.html"
                ],
                options: { livereload: true },
                tasks: []
            },
            js: {
                files: [
                    'assets/js/plugins/*.js',
                    'assets/js/libs/*.js',
                    'assets/js/*.js'
                ],
                options: { livereload: true },
                tasks: [
                    'notify:js',
                    'uglify:development'
                ]
            },
            sass: {
                files: [
                    'assets/css/sass/*.scss',
                    'assets/css/sass/libs/*.scss'
                ],
                options: { livereload: true },
                tasks: [
                    'notify:sass',
                    'sass:development'
                ]
            }
        },

        // I need the the css output to originate from the same location.
        // The difference between the production level is the
        // level of compression
        sass: {
            development: {
                options: {
                    style: 'expanded',
                    trace: true,
                    noCache: true
                },
                files: {
                    'assets/css/styles.css': 'assets/css/sass/main.scss'
                }
            },
            production: {
                options: {
                    style: 'compressed',
                    trace: false,
                    noCache: true
                },
                files: {
                    'assets/css/styles.css': 'assets/css/sass/main.scss'
                }
            }
        },
        uglify: {
            development: {
                options: {
                    banner: '/*!\n' +
                        ' * <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd H:MM:ss") %>\n' +
                        ' * Development build\n' +
                        ' * https://github.com/adamcbrewer/launchpad\n *\n' +
                        ' */\n',
                    compress: false,
                    preserveComments: true,
                    mangle: false,
                    beautify: true,
                    report: 'min'
                },
                files: [
                    {
                        src: [
                            'assets/js/libs/jquery.js',
                            'assets/js/script.js',
                        ],
                        dest: 'assets/js/min/script.min.js'
                    }
                ]
            },
            production: {
                options: {
                    banner: '/*!\n' +
                        ' * <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd H:MM:ss") %>\n' +
                        ' * Production build\n' +
                        ' */\n',
                    compress: true,
                    preserveComments: false,
                    mangle: false,
                    report: 'min'
                },
                files: [
                    {
                        src: [
                            'assets/js/libs/jquery.js',
                            'assets/js/script.js',
                        ],
                        dest: 'assets/js/min/script.min.js'
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', [
        'notify',
        'watch'
    ]);

    // prep files for production
    grunt.registerTask('build', [
        'notify:build',
        'sass:production',
        'uglify:production'
    ]);

};
