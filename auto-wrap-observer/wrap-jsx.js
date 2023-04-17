/* eslint-disable */
'use-strict';

globalThis['__auto_wrap_mobx_observer_hoc__'] = true

var observer
try {
  observer = require('mobx-react-lite').observer
} catch (error) {
  console.error(`[use-mobx] mobx-react-lite is not installed. Please install it to use the auto wrap feature.`, error);
}

var wrapJsx = (jsx) => (type, ...args) => {
  var observed = typeof type === 'function' ? observer(type) : type
  return jsx(observed,...args)
}

module.exports = wrapJsx
