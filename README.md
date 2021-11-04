# use-mobx-observable

* EARLY VERSION, NOT STABLE

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
  return selected;
}

function myComponent({observableOrder}) {
  const latestPrice = useSelector(() => observableOrder.price)
  return <h1>{latestPrice}</h1>
}
```

However, in practice, you'll still need to create an observable for `computed` and `actions`. 

# Do it at once

```jsx
import { useObservable, mapProps } from 'use-mobx-observable'

function MyComponent() {

  let store = useObservable(() => {
    return {
      count: 0,
      get countText() {
        return `Count: ${this.count}`
      },
      add() {
        this.count += 1
      },
    }
  })

  return (
    <div>
      <h1>{store.countText}</h1>
      <button onClick={() => store.add()}>Add</button>
    </div>
  )
}

```
