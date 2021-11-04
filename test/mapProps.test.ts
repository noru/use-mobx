import { observable } from 'mobx'
import { mapProps, select } from '../src/mapProps'
import flow from 'lodash.flow'

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

test('select: extends object', () => {

  let source = getSource()
  let res = select(source, { aa: 'a', bb: 'b' })

  expect(res()).toEqual({ aa: 1, bb: 2 })
  expect(res({ c: 3 })).toEqual({ aa: 1, bb: 2, c: 3 })

})

test('select: extends object, with array', () => {

  let source = getSource()
  let res = select(source, ['a', 'b'])

  expect(res()).toEqual({ a: 1, b: 2 })
  expect(res({ c: 3 })).toEqual({ a: 1, b: 2, c: 3 })

})

test('select: composed', () => {

  let source = getSource()
  let res1 = select(source, { aa: 'a', bb: 'b' })()
  let res2 = select(source, ['b'])(res1)
  expect(res2).toEqual({ aa: 1, bb: 2, b: 2 })

  let composed = flow(
    select(source, { aa: 'a', bb: 'b' }),
    select(source, ['b'])
  )
  expect(composed()).toEqual({ aa: 1, bb: 2, b: 2 })
  expect(composed({ c: 5 })).toEqual({ aa: 1, bb: 2, b: 2, c: 5 })

})