module.exports = function(grunt) {

    // Load the all the plugins that Grunt requires
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
            '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>;' +
            ' Licensed <%%= props.license %> */\n',
        meta: {
            version: '0.1.0'
        },
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
                    message: 'Completed'
                }
            }
        },
        watch: {
            options: { nospawn: true },
            env: {
                // Sstatic and environment files
                files: [
                    "Gruntfile.js",
                    "*.html"
                ],
                options: { livereload: true },
                tasks: [
                    'notify:watch'
                ]
            },
            js: {
                files: [
                    'assets/js/*.js',
                    'assets/js/**/*.js'
                ],
                options: { livereload: true },
                tasks: [
                    'uglify:development'
                ]
            }<% if (data.sass) { %>,
            sass: {
                files: [
                    'assets/css/sass/*.scss',
                    'assets/css/sass/libs/*.scss'
                ],
                options: { livereload: true },
                tasks: [
                    'sass:development'
                ]
            }<% } %>
        }<% if (data.sass) { %>,
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
        }<% } %>,
        uglify: {
            development: {
                options: {
                    banner: '<%%= banner %>',
                    compress: false,
                    preserveComments: true,
                    mangle: false,
                    beautify: true,
                    report: 'min'
                },
                files: [
                    {
                        src: [
                            'assets/js/script.js'<% if (data.jquery) { %>,
                            'assets/js/libs/jquery.js'<% } %>
                        ],
                        dest: 'assets/js/main.min.js'
                    }
                ]
            },
            production: {
                options: {
                    banner: '<%%= banner %>',
                    compress: true,
                    preserveComments: false,
                    mangle: false,
                    beautify: false,
                    report: 'min'
                },
                files: [
                    {
                        src: [
                            'assets/js/script.js'<% if (data.jquery) { %>,
                            'assets/js/libs/jquery.js'<% } %>
                        ],
                        dest: 'assets/js/main.min.js'
                    }
                ]
            }
        },
        imagemin: {
            production: {
                options: {
                    optimizationLevel: 4,
                    progressive: true,
                    pngquant: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: [
                        '*.{png,jpg,gif}',
                        '**/*.{png,jpg,gif}',
                        '!min/*'
                    ],
                    dest: 'assets/img/min/'
                }]
            }
        }<% if (data.jquery || data.modernizr) { %>,
        copy: {
            init: {
                files: [
                    <% if (data.jquery) { %>{
                        src: 'bower_components/jquery/jquery.js',
                        dest: 'assets/js/libs/jquery.js'
                    },<% } %><% if (data.modernizr) { %>{
                        src: 'bower_components/modernizr/modernizr.js',
                        dest: 'assets/js/libs/modernizr.js'
                    }<% } %>
                ]
            }
        }<% } %>
    });

    // Run this after a fresh generation/installation
    grunt.registerTask('init', [
        <% if (data.jquery || data.modernizr) { %>'copy:init',<% } %>
    ]);

    // For local developing
    grunt.registerTask('default', [
        'watch'
    ]);

    // prep files for production
    grunt.registerTask('build', [
        <% if (data.sass) { %>'sass:production',
        <% } %>'uglify:production',
        'imagemin:production',
        'notify:build',
    ]);

};
