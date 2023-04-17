# use-mobx-observable

[![npm version](https://badge.fury.io/js/use-mobx-observable.svg)](https://badge.fury.io/js/use-mobx-observable)
[![pages-build-deployment](https://github.com/noru/use-mobx/actions/workflows/pages/pages-build-deployment/badge.svg?branch=master)](https://github.com/noru/use-mobx/actions/workflows/pages/pages-build-deployment)
[![npm](https://github.com/noru/use-mobx/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/noru/use-mobx/actions/workflows/npm-publish.yml)
[![Coverage Status](https://coveralls.io/repos/github/noru/use-mobx/badge.svg?branch=master)](https://coveralls.io/github/noru/use-mobx?branch=master)

Use mobx observable like `useState`

## Note: 
- [You Might Not Need Locally Observable](https://mobx.js.org/react-integration.html#you-might-not-need-locally-observable-state)
- Automatically wrap `observer` HOC using tweaked [jsx-runtime](#jsx-runtime) (require: React >=17)

### Install

```sh
npm install mobx@^6 react@^16.8 # peer dependencies
npm install use-mobx-observable
```

👉[API Docs](https://noru.github.io/use-mobx)👈

### Problem

The current mobx hooks from [mobx-react-lite](https://www.npmjs.com/package/mobx-react-lite) uses pattern like below:

```jsx
function MyComponent() {

  let store = useLocalObservable(() => ({ count: 0 }))

  return (
    <Observer>                      // <---
    {                               // <---
      () =>                         // <---
        <div>{store.count}</div>
    }                               // <---
    </Observer>                     // <---
  )
}
```

To be reactive, you have to wrap your jsx with `<Observer>` and use render props, which is not a favorable way.

There was a [Discussion](https://github.com/mobxjs/mobx/discussions/2566) around this issue. At the end of it, simple solution was proposed:

```jsx
function useSelector(select) {
  const [selected, setSelected] = useState(select)
  useEffect(() => autorun(() => setSelected(select())), [])
  return selected
}

function myComponent({ observableOrder }) {
  const latestPrice = useSelector(() => observableOrder.price)
  return <h1>{latestPrice}</h1>
}
```

However, in practice, you'll still need to create an observable for `computed` and `actions`.

# Do it at once

```jsx
import { useObservable, select, useMultiObservables } from 'use-mobx-observable'

function MyComponent() {

  // create local observable, with plain object or an initializer
  let store = useObservable({
      count: 0,
      get countText() {
        return `Count: ${this.count}`
      },
      add() {
        this.count += 1
      },
    })

  // map external observable props to getters
  let store2 = useObservable(select(externalStore, ['propsA', 'propsB'])({ count: 0 }/* Optional */))

  // chaining with lodash.flow for mapping multiple sources
  let store3 = useObservable(
    _.flow(
      select(externalStore, ['propsA', 'propsB'],
      select(externalStore2, { renameC: 'propsC' },  // rename getters
    )({
      get sum() {
        return this.propsA + this.renameC
      }
     })
  )

  // use observable directly, returned value can be omitted since it is the same as input
  // Be ware of the performance impact: any props change will trigger a rerender.
  useObservable(store)

  return (
    <div>
      <h1>{store.countText}</h1>
      <button onClick={() => store.add()}>Add</button>
    </div>
  )
}

```

## Automatically wrap `observer` HOC

Since React 17, jsx transformation is done via `react/run-time` instead of `React.createElement`. Typescript 4.1 introduced new [jsx options](https://www.typescriptlang.org/tsconfig#jsx) which enabled customized `jsx` factory.

Hence, automatically wrap all your components with [`observer`](https://mobx.js.org/api.html#observer) can be easily done via change your `tsconfig.json`:


```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react-jsx",
    "jsxImportSource": "use-mobx-observable"
  }
}

```

If you choose this way, please remember install `mobx-react-lite`. Check [auto-wrap-observer/wrap-jsx.js](auto-wrap-observer/wrap-jsx.js) for detail.

### Performance Impact?
[TLDR;](https://mobx.js.org/react-integration.html#always-read-observables-inside-observer-components) No, nothing you should worry about