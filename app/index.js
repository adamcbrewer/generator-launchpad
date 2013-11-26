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
            message: 'Your title?',
            default: null
        },
        {
            type: 'input',
            name: 'usertwitter',
            message: 'Your Twitter username?',
            default: null
        },
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
        // Components & libraries
        {
            type: 'confirm',
            name: 'jquery',
            message: 'Include jQuery?',
            default: true
        },
        {
            type: 'confirm',
            name: 'modernizr',
            message: 'Include Modernizr?',
            default: false
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
        }
    ];

    this.prompt(promptsFirst, function (answers) {

        self.data.bowerComponents = [];

        // Application
        self.data.appname = answers.appname;
        self.data.repo = answers.repo;
        self.data.repoUrl = answers.repoUrl || '';
        self.data.robots = answers.robots;

        // Componenets & Libraries
        self.data.jquery = answers.jquery;
        self.data.modernizr = answers.modernizr;

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
    this.mkdir('assets/css');
    this.mkdir('assets/js');
    this.mkdir('assets/img');

    // Workflow
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    this.copy('htaccess', '.htaccess');
    this.copy('gitignore', '.gitignore');

    // Assets
    this.copy('assets/htaccess', 'assets/.htaccess');
    this.copy('assets/js/script.js', 'assets/js/script.js');
    this.copy('assets/img/favicon.ico', 'assets/img/favicon.ico');

};

// The rest of the application files and directory structure
LaunchpadGenerator.prototype.projectfiles = function projectfiles() {

    // Meta
    this.template('_humans.txt', 'humans.txt');
    this.template('_robots.txt', 'robots.txt');
    this.copy('crossdomain.xml', 'crossdomain.xml');
    this.copy('404.xml', '404.xml');

};
