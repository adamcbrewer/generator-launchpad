/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('launchpad generator', function () {
    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('launchpad:app', [
                '../../app'
            ]);
            done();
        }.bind(this));
    });

    it('creates important application files', function (done) {

        var expected = [
            // add files you expect to exist here.
            '.editorconfig',
            '.gitignore',
            '.htaccess',
            '.jshintrc',
            'bower.json',
            'Gruntfile.js',
            'humans.txt',
            'index.html',
            'package.json',
            'robots.txt',
            'readme.md',
            'assets/.htaccess',
            'assets/js/script.js',
            'assets/css/styles.css',
            'assets/img/favicon.ico'
        ];

        helpers.mockPrompt(this.app, {
            'appname': 'Mocha Testing',
            'robots': true,

            'yesSass': false,

            'repo': true,
            'repoUrl': 'http://test.com',

            'username': 'Your Name',
            'usertitle': 'Web Developer',
            'usertwitter': '@youreawesome'

        });

        this.app.options['skip-install'] = true;

        this.app.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });

    });

    it('creates sass files', function (done) {

        var expected = [
            'assets/css/sass/libs/_mixins.scss',
            'assets/css/sass/libs/_functions.scss',
            'assets/css/sass/libs/_reset.scss',
            'assets/css/sass/_base.scss',
            'assets/css/sass/_fonts.scss',
            'assets/css/sass/_print.scss',
            'assets/css/sass/_layout.scss',
            'assets/css/sass/_modules.scss',
            'assets/css/sass/_vars.scss',
            'assets/css/sass/main.scss'
        ];

        helpers.mockPrompt(this.app, {
            'yesSass': true,
            'cssExtras': ['reset']
        });

        this.app.options['skip-install'] = true;

        this.app.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });

    });

    it('creates extras', function (done) {

        helpers.mockPrompt(this.app, {
            'appname': 'Mocha Testing',
            'yesExtras': true,
            'extras': ['jquery', 'modernizr', 'analytics'],
            'analyticsId': 'UA-AAAAAA-A',
        });

        this.app.options['skip-install'] = true;

        this.app.run({}, function () {
            // helpers.assertFiles(expected);
            done();
        });

    });

});
