module.exports = function(grunt) {

    // Load the all the plugins that Grunt requires
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    /**
     * Grunt config vars
     *
     */
    var config = {};
    config.assetsDir = 'assets/';
    config.cssFilenameOutput = 'styles.css';
    config.jsFilenameOutput = 'main.min.js';


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,
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
                    '<%%= config.assetsDir %>js/*.js',
                    '<%%= config.assetsDir %>js/**/*.js'
                ],
                options: { livereload: true },
                tasks: [
                    'uglify:development'
                ]
            },
            sass: {
                files: [
                    '<%%= config.assetsDir %>css/sass/*.scss',
                    '<%%= config.assetsDir %>css/sass/libs/*.scss'
                ],
                options: { livereload: true },
                tasks: [
                    'sass:development',
                    'autoprefixer'
                ]
            }
        },
        sass: {
            development: {
                options: {
                    style: 'expanded',
                    trace: true,
                    noCache: true
                },
                files: {
                    '<%%= config.assetsDir %>css/<%%= config.cssFilenameOutput %>': '<%%= config.assetsDir %>css/sass/main.scss'
                }
            },
            production: {
                options: {
                    style: 'compressed',
                    trace: false,
                    noCache: true
                },
                files: {
                    '<%%= config.assetsDir %>css/<%%= config.cssFilenameOutput %>': '<%%= config.assetsDir %>css/sass/main.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: [
                    'last 2 versions',
                    'ie 9'
                ]
            },
            single_file: {
                options: {},
                src: '<%%= config.assetsDir %>css/<%%= config.cssFilenameOutput %>',
                dest: '<%%= config.assetsDir %>css/<%%= config.cssFilenameOutput %>'
            }
        },
        uglify: {
            development: {
                options: {
                    compress: false,
                    preserveComments: true,
                    mangle: false,
                    beautify: true,
                    report: 'min'
                },
                files: [
                    {
                        src: [
                            '<%%= config.assetsDir %>js/script.js'<% if (data.jquery) { %>,
                            '<%%= config.assetsDir %>js/libs/jquery.js'<% } %>
                        ],
                        dest: '<%%= config.assetsDir %>js/<%%= config.jsFilenameOutput %>'
                    }
                ]
            },
            production: {
                options: {
                    compress: true,
                    preserveComments: false,
                    mangle: false,
                    beautify: false,
                    report: 'min'
                },
                files: [
                    {
                        src: [
                            '<%%= config.assetsDir %>js/script.js'<% if (data.jquery) { %>,
                            '<%%= config.assetsDir %>js/libs/jquery.js'<% } %>
                        ],
                        dest: '<%%= config.assetsDir %>js/<%%= config.jsFilenameOutput %>'
                    }
                ]
            }
        }<% if (data.modernizr) { %>,
        modernizr: {
            dist: {
                // Look here for the full list of options
                // https://github.com/Modernizr/grunt-modernizr
                devFile : 'remote',
                outputFile : "<%%= config.assetsDir %>js/libs/modernizr.build.js",
                parseFiles : false,
                extra : {
                    load : false,
                },
                // Implicitly declare your tests here
                tests : [
                    'touch'
                ]
            }
        }<% } %>,
        stylestats: {
            src: ['<%%= config.assetsDir %>css/<%%= config.cssFilenameOutput %>']
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
                    cwd: '<%%= config.assetsDir %>img/',
                    src: [
                        '*.{png,jpg,gif}',
                        '**/*.{png,jpg,gif}',
                        '!min/*'
                    ],
                    dest: '<%%= config.assetsDir %>img/min/'
                }]
            }
        }<% if (data.jquery || data.modernizr) { %>,
        copy: {
            init: {
                files: [
                    <% if (data.jquery) { %>{
                        src: 'bower_components/jquery/jquery.js',
                        dest: '<%%= config.assetsDir %>js/libs/jquery.js'
                    },<% } %><% if (data.modernizr) { %>{
                        src: 'bower_components/modernizr/modernizr.js',
                        dest: '<%%= config.assetsDir %>js/libs/modernizr.js'
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

    // only process javascript files
    grunt.registerTask('js', [
        'uglify:development'
    ]);

    // only process images
    grunt.registerTask('img', [
        'imagemin:production'
    ]);

    grunt.registerTask('css', [
        'sass:development',
        'autoprefixer'
    ]);

    grunt.registerTask('stats', [
        'stylestats'
    ]);

    grunt.registerTask('prefix', [
        'autoprefixer'
    ]);

    // prep files for production
    grunt.registerTask('build', [
        'sass:production',
        'autoprefixer',
        'uglify:production',
        'imagemin:production',
        'stats',
        'notify:build',
    ]);

};
