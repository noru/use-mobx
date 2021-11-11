# use-mobx-observable

- EARLY VERSION, NOT STABLE

Use mobx observable like `useState`

### Install

```sh
npm install mobx@^6 react@^16.8 # peer dependencies
npm install use-mobx-observable
```

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

  // or, a helper for multiple stores
  useMultiObservables(store, store2, store3)

  return (
    <div>
      <h1>{store.countText}</h1>
      <button onClick={() => store.add()}>Add</button>
    </div>
  )
}

```
