/* eslint-disable */
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var wrapJsx = require('./auto-wrap-observer/wrap-jsx');

module.exports = {
  ...jsxRuntime,
  jsx: wrapJsx(jsxRuntime.jsx),
}
