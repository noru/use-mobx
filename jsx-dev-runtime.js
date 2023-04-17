/* eslint-disable */
'use strict';

var jsxDevRuntime = require('react/jsx-dev-runtime');
var wrapJsx = require('./auto-wrap-observer/wrap-jsx');

module.exports = {
  ...jsxDevRuntime,
  jsxDEV: wrapJsx(jsxDevRuntime.jsxDEV)
}
