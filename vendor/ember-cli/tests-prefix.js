'use strict';

/*
  This file overrides a file built into ember-cli's build pipeline and allows us to inject the following code, required
  to make the `derequire` package do its transform, which it would refuse when `define` and `require` are not
  declared as variables, but only used as globals.
*/

var define = define; var require = require;
