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
        {
            type: 'input',
            name: 'appname',
            message: 'What are you calling this thing?',
            default: 'MyApp'
        },
        {
            type: 'confirm',
            name: 'humans',
            message: 'Generate humans.txt?',
            default: true
        },
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

    this.prompt(promptsFirst, function (props) {

        this.data.appname = props.appname;
        self.data.bowerComponents = [];

        var promptsSecond = [];

        // Humans.txt related questions
        if (props.humans) {
            self.data.humans = {};

            promptsSecond.push(
                {
                    type: 'input',
                    name: 'username',
                    message: 'Your name?',
                    default: '<name>'
                },
                {
                    type: 'input',
                    name: 'usertitle',
                    message: 'Your title?',
                    default: '<title>'
                },
                {
                    type: 'input',
                    name: 'twittername',
                    message: 'Your Twitter username?',
                    default: '<twitter>'
                }
            );
        }

        // bower.json stuff
        if (props.jquery) self.data.bowerComponents.push('"jquery": ""');
        if (props.modernizr) self.data.bowerComponents.push('"modernizr": ""');

        self.data.bowerComponents = self.data.bowerComponents.join(',');

        this.prompt(promptsSecond, function (props) {
            if (props.username) self.data.humans.username = props.username;
            if (props.usertitle) self.data.humans.usertitle = props.usertitle;
            if (props.twittername) self.data.humans.twittername = props.twittername;

            cb();

        });

    }.bind(this));
};

// Application important files here
LaunchpadGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/templates');

    console.log(this.data.appname);
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
};

// The rest of the application files and directory structure
LaunchpadGenerator.prototype.projectfiles = function projectfiles() {
    var data = this.data;
    // console.log(data);
    if (data.humans) this.template('humans.txt');
    // this.copy('jshintrc', '.jshintrc');
};
