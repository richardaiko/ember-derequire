/* jshint node: true */
'use strict';

var derequire = require('broccoli-derequire');

module.exports = {
  name: 'ember-derequire',

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.options = app.options.derequire || {};

    var defaultOptions = {enabled: this.app.env !== 'test'};
    
    for (var option in defaultOptions) {
      if (!this.options.hasOwnProperty(option)) {
        this.options[option] = defaultOptions[option];
      }
    }
  },

  postprocessTree: function(type, tree) {
    if (type === 'all' && this.isEnabled()) {
      tree = derequire(tree, this.options);
    }
    return tree;
  },
  
  contentFor:function (type) {
    if(type === 'app-boot' && this.isEnabled()){
      return 'var define = define; var require = require;'
    }
  },
  
  isEnabled:function() {
    return this.options && this.options.enabled;
  }
};