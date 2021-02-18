/* jshint node: true */
'use strict';

var derequire = require('broccoli-derequire');

module.exports = {
  name: require('./package').name,

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.hostBuildOptions = app.options.derequire || {};

    var defaultOptions = {enabled: this.app.env !== 'test'};

    for (var option in defaultOptions) {
      if (!this.hostBuildOptions.hasOwnProperty(option)) {
        this.hostBuildOptions[option] = defaultOptions[option];
      }
    }
  },

  postprocessTree: function(type, tree) {
    if (type === 'all' && this._isEnabled()) {
      tree = derequire(tree, this.hostBuildOptions);
    }
    return tree;
  },

  contentFor:function (type) {
    if(type === 'app-boot' && this._isEnabled()){
      return 'var define = define; var require = require;'
    }
  },

  _isEnabled:function() {
    return this.hostBuildOptions && this.hostBuildOptions.enabled;
  }
};
