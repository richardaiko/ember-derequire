'use strict';

const Derequire = require('broccoli-derequire');
const BroccoliDebug = require('broccoli-debug');

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);
    this.hostBuildOptions = app.options.derequire || {};

    let defaultOptions = { enabled: this.app.env !== 'test' };

    for (let option in defaultOptions) {
      if (!this.hostBuildOptions[option]) {
        this.hostBuildOptions[option] = defaultOptions[option];
      }
    }
  },

  postprocessTree(type, tree) {
    if (type === 'all' && this._isEnabled()) {
      let debugTree = BroccoliDebug.buildDebugCallback(this.name);
      let inputTree = debugTree(tree, 'input');
      let transformedTree = new Derequire(inputTree, this.hostBuildOptions);
      tree = debugTree(transformedTree, 'output');
    }
    return tree;
  },

  contentFor(type) {
    // make sure the `derequire` package does its transform on app.js, test-support.js and tests.js, which it would refuse when `define` and `require` are not
    // declared as variables, but only used as globals. tests.js is handled by the /vendor/ember-cli/tests-prefix.js file in our addon, as the original file
    // from ember-cli does not provide a {{content-for "tests-prefix"}} hook unfortunately.
    if (this._isEnabled() && ['app-prefix', 'test-support-prefix'].includes(type)) {
      return 'var define = define; var require = require;';
    }
  },

  _isEnabled() {
    return this.hostBuildOptions && this.hostBuildOptions.enabled;
  },
};
