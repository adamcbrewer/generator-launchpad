'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var LaunchpadGenerator = module.exports = function LaunchpadGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LaunchpadGenerator, yeoman.generators.Base);

LaunchpadGenerator.prototype.askFor = function askFor() {
    var cb = this.async(),
        self = this;

    this.data = {};

    // have Yeoman greet the user.
    console.log(this.yeoman);
    console.log('Launchpad is an opinionated HTML5 starter kit for quick web apps and sites.');

    var promptsFirst = [
        // Application & workflow
        {
            type: 'input',
            name: 'appname',
            message: 'What are you calling this project?',
            default: 'MyApp'
        },
        {
            type: 'confirm',
            name: 'robots',
            message: 'Robots can crawl this project?',
            default: true
        },
        {
            type: 'confirm',
            name: 'yesExtras',
            message: 'Include third-party libraries?',
            default: true
        },
        // Components & libraries
        {
            type: 'checkbox',
            name: 'extras',
            message: 'Which extras would you like?',
            when: function (answers) {
                return answers.yesExtras;
            },
            choices: [
                {
                    name: 'jQuery?',
                    value: 'jquery',
                    checked: true
                },
                {
                    name: 'Modernizr?',
                    value: 'modernizr',
                    checked: true
                },
                {
                    name: 'Google analytics.js?',
                    value: 'analytics',
                    checked: false
                }
            ]
        },
        {
            type: 'input',
            name: 'analyticsId',
            message: 'Enter your Google analytics ID, if you have it ready',
            default: 'UA-XXXXXX-X',
            when: function (answers) {
                return (answers.extras && answers.extras.indexOf('analytics') !== -1);
            }
        },
        // CSS
        {
            type: 'confirm',
            name: 'yesSass',
            message: 'Include SASS?',
            default: true
        },
        {
            type: 'checkbox',
            name: 'cssExtras',
            message: 'What are your CSS preferences?',
            when: function (answers) {
                return answers.yesSass;
            },
            choices: [
                {
                    name: 'reset.css?',
                    value: 'reset',
                    checked: false
                }
            ]
        },
        {
            type: 'confirm',
            name: 'repo',
            message: 'Do you already have a repo for this project?',
            default: false
        },
        {
            type: 'input',
            name: 'repoUrl',
            message: 'What\'s the URL of this repo?',
            default: null,
            when: function (answers) {
                return answers.repo;
            }
        },
        // User/Developer
        {
            type: 'input',
            name: 'username',
            message: 'Your name?',
            default: null
        },
        {
            type: 'input',
            name: 'usertitle',
            message: 'Your role/title?',
            default: null
        },
        {
            type: 'input',
            name: 'usertwitter',
            message: 'Your Twitter username?',
            default: null
        }
    ];

    this.prompt(promptsFirst, function (answers) {

        var hasExtra = function (extras, choice) {
            extras = extras || [];
            return extras.indexOf(choice) !== -1;
        }

        self.data.bowerComponents = [];

        // Application
        self.data.appname = answers.appname || 'FILE_NAME';
        self.data.repo = answers.repo;
        self.data.repoUrl = answers.repoUrl || '';
        self.data.robots = answers.robots;

        // JS
        var extras = answers.extras;
        self.data.jquery = hasExtra(extras, 'jquery');
        self.data.modernizr = hasExtra(extras, 'modernizr');
        self.data.analytics = hasExtra(extras, 'analytics');
        self.data.analyticsId = answers.analyticsId || 'UA-XXXXXX-X';

        // CSS
        var cssExtras = answers.cssExtras || [];
        self.data.sass = answers.yesSass;
        self.data.cssReset = hasExtra(cssExtras, 'reset');

        self.data.humans = {};
        self.data.humans.username = answers.username || '<name>';
        self.data.humans.usertitle = answers.usertitle || '<title>';
        self.data.humans.usertwitter = answers.usertwitter || '<twitter>';

        cb();

    }.bind(this));
};

// Application important files here
LaunchpadGenerator.prototype.app = function app() {

    // Directory structure
    this.mkdir('assets');
    this.mkdir('assets/js');
    if (this.data.jquery || this.data.modernizr) {
        this.mkdir('assets/js/libs');
    }
    this.mkdir('assets/img');
    this.mkdir('assets/css');
    if (this.data.sass) {
        this.mkdir('assets/css/sass');
        this.mkdir('assets/css/sass/helpers');
    }

    // Workflow
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_gruntfile.js', 'Gruntfile.js');
    this.template('_readme.md', 'README.md');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    this.copy('htaccess', '.htaccess');
    this.copy('gitignore', '.gitignore');

};

// The rest of the application files and directory structure
LaunchpadGenerator.prototype.projectfiles = function projectfiles() {

    // Meta
    this.template('_humans.txt', 'humans.txt');
    this.template('_robots.txt', 'robots.txt');
    this.copy('404.html', '404.html');

    // Assets - General
    this.copy('assets/htaccess', 'assets/.htaccess');

    // JS
    this.template('assets/js/_script.js', 'assets/js/script.js');

    // Images
    this.copy('assets/img/favicon.ico', 'assets/img/favicon.ico');

    // CSS
    this.template('assets/css/_styles.css', 'assets/css/styles.css');
    if (this.data.sass) {
        var baseCss = this.data.cssReset ? 'reset' : 'normalize';
        this.copy('assets/css/sass/vars.scss', 'assets/css/sass/_vars.scss');
        this.copy('assets/css/sass/fonts.scss', 'assets/css/sass/_fonts.scss');
        this.copy('assets/css/sass/base.scss', 'assets/css/sass/_base.scss');
        this.copy('assets/css/sass/media.scss', 'assets/css/sass/_media.scss');
        this.copy('assets/css/sass/layout.scss', 'assets/css/sass/_layout.scss');
        this.copy('assets/css/sass/modules.scss', 'assets/css/sass/_modules.scss');
        this.template('assets/css/sass/main.scss', 'assets/css/sass/main.scss');
        this.copy('assets/css/sass/helpers/placeholders.scss', 'assets/css/sass/helpers/_placeholders.scss');
        this.copy('assets/css/sass/helpers/mixins.scss', 'assets/css/sass/helpers/_mixins.scss');
        this.copy('assets/css/sass/helpers/functions.scss', 'assets/css/sass/helpers/_functions.scss');
        this.copy('assets/css/sass/helpers/'+baseCss+'.scss', 'assets/css/sass/helpers/_'+baseCss+'.scss');
    }

    // The HTML
    this.template('_index.html', 'index.html');

};
