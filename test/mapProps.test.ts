import { observable } from 'mobx'
import { mapProps } from '../src/mapProps'

const getSource = () => observable({
  a: 1,
  get b() {
    return this.a + 1
  },
  c() {
    this.a += 1
  }
}, undefined, { autoBind: true })

test('mapProps: map props as array', async () => {

  let source = getSource()
  let res = mapProps(source, ['a', 'b', 'c'])

  // @ts-expect-error : props not in source
  let res2 = mapProps(source, ['non-exist'])

  expect(res.a).toBe(1)
  expect(res.b).toBe(2)
  res.c()
  expect(res.a).toBe(2)
})

test('mapProps: map props as object', async () => {

  let source = getSource()
  let res = mapProps(source, {
    aa: 'a',
    bb: 'b',
    cc: 'c',
  })

  // @ts-expect-error : props not in source
  let res2 = mapProps(source, {
    aa: 'non-exist-prop',
  })

  // @ts-expect-error : props not in map
  res.nonexist

  expect(res.aa).toBe(1)
  expect(res.bb).toBe(2)
  res.cc()
  expect(res.aa).toBe(2)
})

test('mapProps: map props are enumerable', async () => {

  let source = getSource()
  let res = mapProps(source, ['a', 'b', 'c'])
  expect(Object.keys({ ...res })).toEqual(['a', 'b', 'c'])

})

test('mapProps: extends object', async () => {

  let sym = Symbol()
  let source = getSource()
  let res = mapProps(source, ['a'], { d: sym })

  expect(res.d).toBe(sym)
  expect(Object.keys(res)).toEqual(['d', 'a'])

})