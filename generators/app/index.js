'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('underscore.string');

/**
 * Inuit Bower package options.
 * Organise alphabetically within Shearing layer category.
 */
var inuitModules = [

  // Settings
  'inuit-defaults',
  'inuit-responsive-settings',

  // Tools
  'inuit-functions',
  'inuit-mixins',
  'inuit-responsive-tools',
  'inuit-tools-widths',

  // Generic
  'inuit-box-sizing',
  'inuit-normalize',
  'inuit-reset',
  'inuit-shared',

  // Base
  'inuit-headings',
  'inuit-images',
  'inuit-lists',
  'inuit-page',
  'inuit-paragraphs',

  // Object
  'inuit-box',
  'inuit-buttons',
  'inuit-flag',
  'inuit-layout',
  'inuit-list-bare',
  'inuit-list-block',
  'inuit-list-inline',
  'inuit-list-ui',
  'inuit-media',
  'inuit-pack',
  'inuit-tables',
  'inuit-tabs',

  // Trumps
  'inuit-clearfix',
  'inuit-headings-trumps',
  'inuit-print',
  'inuit-spacing',
  'inuit-spacing-responsive',
  'inuit-widths',
  'inuit-widths-responsive'
];

/**
 * CreepyCSS Bower package options.
 * Organise alphabetically within shearing layer category.
 */
var creepyModules = [
  // Objects
  'creepycss-band',
  'creepycss-exhibit',
  'creepycss-wrapper',
  
  // Trumps
  'creepycss-text-align',
  'creepycss-text-align-responsive'
];

/**
 * Plump CSS Bower package options.
 * Organise alphabetically within shearing layer category.
 */
var plumpModules = [

  // Settings
  'plumpcss-defaults',
  'plumpcss-responsive-settings',

  // Tools
  'plumpcss-functions',
  'plumpcss-mixins',

  // Objects
  'plumpcss-band',
  'plumpcss-exhibit',
  'plumpcss-meter',
  'plumpcss-stack',
  'plumpcss-widescreen-frame',
  'plumpcss-wrapper',

  // Trumps
  'plumpcss-floats',
  'plumpcss-responsive-floats',
  'plumpcss-hide',
  'plumpcss-responsive-hide',
  'plumpcss-text-align',
  'plumpcss-responsive-text-align'
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
    },
    {
      type : 'checkbox',
      name : 'creepyModules',
      message : 'Which CreepyCSS modules do you require?',
      choices : this._getModuleChoices(creepyModules, true)
    },
    {
      type : 'checkbox',
      name : 'plumpModules',
      message : 'Which plumpcss modules do you require?',
      choices : this._getModuleChoices(plumpModules, true)
    }];

    this.prompt(prompts, function(props) {
      this.config = props;
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
      this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), { appName : _.slugify(this.appname) });

      // Create extra directories.
      mkdirp(this.destinationPath('src/images'));
      mkdirp(this.destinationPath('src/scripts'));
    },
    tools: function() {
      this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
      this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
      this.fs.copy(this.templatePath('jshintignore'), this.destinationPath('.jshintignore'));
      this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('sass-lint'), this.destinationPath('.sass-lint.yml'));
      this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
      this.fs.copy(this.templatePath('gulp-config.json'), this.destinationPath('gulp-config.json'));
    }
  },

  install: function() {

    this.log('Installing Bower packages and running ' + chalk.yellow('npm install'));
    var bowerModules = this.config.inuitModules.concat(this.config.creepyModules, this.config.plumpModules);
    this.bowerInstall(bowerModules, { save: true });
    
    this.npmInstall();
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
