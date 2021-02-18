'use strict';

const Derequire = require('broccoli-derequire');

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);
    this.hostBuildOptions = app.options.derequire || {};

    var defaultOptions = { enabled: this.app.env !== 'test' };

    for (var option in defaultOptions) {
      if (!this.hostBuildOptions[option]) {
        this.hostBuildOptions[option] = defaultOptions[option];
      }
    }
  },

  postprocessTree(type, tree) {
    if (type === 'all' && this._isEnabled()) {
      tree = new Derequire(tree, this.hostBuildOptions);
    }
    return tree;
  },

  contentFor(type) {
    if (type === 'app-boot' && this._isEnabled()) {
      return 'var define = define; var require = require;';
    }
  },

  _isEnabled() {
    return this.hostBuildOptions && this.hostBuildOptions.enabled;
  },
};
