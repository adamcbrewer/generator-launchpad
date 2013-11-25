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
        // Application
        {
            type: 'input',
            name: 'appname',
            message: 'What are you calling this thing?',
            default: 'MyApp'
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
        }

    ];

    this.prompt(promptsFirst, function (answers) {

        self.data.bowerComponents = [];

        // Application
        self.data.appname = answers.appname;

        // Componenets & Libraries
        if (answers.jquery) self.data.bowerComponents.push('"jquery": ""');
        if (answers.modernizr) self.data.bowerComponents.push('"modernizr": ""');

        self.data.bowerComponents = self.data.bowerComponents.join(',');

        self.data.humans = {};
        self.data.humans.username = answers.username || '<name>';
        self.data.humans.usertitle = answers.usertitle || '<title>';
        self.data.humans.usertwitter = answers.usertwitter || '<twitter>';

        cb();

    }.bind(this));
};

// Application important files here
LaunchpadGenerator.prototype.app = function app() {
    // this.mkdir('app');
    // this.mkdir('app/templates');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
};

// The rest of the application files and directory structure
LaunchpadGenerator.prototype.projectfiles = function projectfiles() {
    var data = this.data;
    this.template('humans.txt');
};
