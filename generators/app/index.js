'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('underscore.string');

/**
 *    Bower inuit package options (prepended with inuitcss-).
 *    Organise alphabetically within Shearing layer category.
 */
var inuitModules = [

  // Settings
  'defaults',
  'responsive-settings',

  // Tools
  'functions',
  'mixins',
  'responsive-tools',
  'widths',

  // Generic
  'box-sizing',
  'normalize',
  'reset',
  'shared',

  // Base
  'headings',
  'images',
  'lists',
  'page',
  'paragraphs',

  // Object
  'box',
  'buttons',
  'flag',
  'layout',
  'list-bare',
  'list-block',
  'list-inline',
  'list-ui',
  'media',
  'pack',
  'tables',
  'tabs',

  // Trumps
  'clearfix',
  'headings-trumps',
  'print',
  'spacing',
  'spacing-responsive',
  'widths',
  'widths-responsive'
];

/**
 *    Bower plump package options (prepended with plumpcss-).
 *    Organise alphabetically within shearing layer category.
 */
var plumpModules = [

  // Settings
  'defaults',
  'responsive-settings',

  // Tools
  'functions',
  'mixins',

  // Objects
  'band',
  'exhibit',
  'meter',
  'stack',
  'widescreen-frame',
  'wrapper',

  // Trumps
  'floats',
  'responsive-floats',
  'hide',
  'responsive-hide',
  'text-align',
  'responsive-text-align'
];

module.exports = yeoman.generators.Base.extend({
  
  prompting: function() {
    
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-creepy-webapp') + ' generator!'
    ));

    var prompts = [{
      type : 'checkbox',
      name : 'inuitModules',
      message : 'Which inuit modules do you require?',
      choices : this._getModuleChoices(inuitModules, true)
    },{
      type : 'checkbox',
      name : 'plumpModules',
      message : 'Which plumpcss modules do you require?',
      choices : this._getModuleChoices(plumpModules, true)
    }];

    this.prompt(prompts, function (props) {
      this.inuitModules = props.inuitModules;
      this.plumpModules = props.plumpModules;
      done();
    }.bind(this));
  },

  writing: {
    project: function() {
    
      // Copy base stylesheets.
      this.fs.copy(this.templatePath('src/styles/_style.scss'), this.destinationPath('src/styles/style.scss'));
      this.fs.copy(this.templatePath('src/styles/_settings.colors.scss'), this.destinationPath('src/styles/_settings.colors.scss'));

      // Copy HTML templates.
      this.fs.copy(this.templatePath('src/templates'), this.destinationPath('src/templates'));
      this.fs.copy(this.templatePath('src/index.html'), this.destinationPath('src/index.html'));

      // Template NPM and Bower config.
      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), { appName : _.slugify(this.appname) });
      this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), {
        appName : _.slugify(this.appname),
        inuitModules : this.inuitModules,
        plumpModules : this.plumpModules
      });

      // Create extra directories.
      mkdirp(this.destinationPath('src/images'));
      mkdirp(this.destinationPath('src/scripts'));
    },
    tools: function() {
      this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
      this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
      this.fs.copy(this.templatePath('jshintignore'), this.destinationPath('.jshintignore'));
      this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('scss-lint'), this.destinationPath('.scss-lint.yml'));
      this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
      this.fs.copy(this.templatePath('gulp-config.json'), this.destinationPath('gulp-config.json'));
    }
  },

  install: function() {
    this.installDependencies();
  },

  /**
   * Helper to create a choices array for checkbox prompts.
   */
  _getModuleChoices: function(modules, autoCheck) {
    var choices = [];
    for (var i = 0; i < modules.length; i++) {
      choices[i] = {
        name    : modules[i],
        checked : autoCheck
      };
    }
    return choices;
  },

});
