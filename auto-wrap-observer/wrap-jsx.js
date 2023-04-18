/* eslint-disable */
'use-strict';

var observer
try {
  observer = require('mobx-react-lite').observer
} catch (error) {
  console.error(`[use-mobx] mobx-react-lite is not installed. Please install it to use the auto wrap feature.`, error)
  throw error
}

globalThis['__auto_wrap_mobx_observer_hoc__'] = true

var _cache = new WeakMap()
var wrapJsx = (jsx) => (type, ...args) => {

  if (typeof type === 'function') {
    switch(true) {
      case type.$$tyoeof: // skip internal react components: memo/forwardRef/provider...
        break
      case type.prototype && 'render' in type.prototype: // class component not supported
        break
      case type.name === 'Route': // skip react-router
        break
      default:
        if (!_cache.has(type)) {
          _cache.set(type, observer(type))
        }
        type = _cache.get(type)
    }
  }
  return jsx(type,...args)
}

module.exports = wrapJsx
