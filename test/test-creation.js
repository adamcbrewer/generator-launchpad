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
            'assets/img/favicon.ico'
        ];

        helpers.mockPrompt(this.app, {
            'appname': 'Mocha Testing',

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
            'assets/css/sass/helpers/_placeholders.scss',
            'assets/css/sass/helpers/_mixins.scss',
            'assets/css/sass/helpers/_functions.scss',
            'assets/css/sass/helpers/_reset.scss',
            'assets/css/sass/_base.scss',
            'assets/css/sass/_fonts.scss',
            'assets/css/sass/_media.scss',
            'assets/css/sass/_layout.scss',
            'assets/css/sass/_modules.scss',
            'assets/css/sass/_vars.scss',
            'assets/css/sass/main.scss'
        ];

        helpers.mockPrompt(this.app, {
            'appname': 'Mocha Testing',
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

});
