import { observable, configure } from 'mobx'
import { select } from '../src/select'
import flow from 'lodash.flow'

configure({
  enforceActions: 'never'
})

const getSource = () => observable({
  a: 1,
  get b() {
    return this.a + 1
  },
  c() {
    this.a += 1
  }
}, undefined, { autoBind: true })

describe('helper: select', () => {

  test('extends object', () => {

    let source = getSource()
    let res = select(source, { aa: 'a', bb: 'b'})
  
    expect(res()).toEqual({ aa: 1, bb: 2 })
    function e() {}
    expect(res({ c: 3, get d() { return this.aa }, e, f: [] })).toEqual({ aa: 1, bb: 2, c: 3, d: 1, e, f: [] })
  
  })
  
  test('extends object, with array', () => {
  
    let source = getSource()
    let res = select(source, ['a', 'b'])
  
    expect(res()).toEqual({ a: 1, b: 2 })
    expect(res({ c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  
  })
  
  test('composed', () => {
  
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
  
  test('array, typings', () => {
  
    let source = getSource()
    let res = select(source, ['a', 'b'])({ d: 1 })
    // @ts-expect-error : props not in map
    res.nonexist
    // @ts-expect-error : props not in source
    let res2 = select(source, ['a', 'b', 'd'])({ d: 1 })
  
    res2.d // ok
  
    // @@@@ts-expect-error: prop in source but not mapped
    res.c // TODO, how to add boundary for this case?
  
  })
  
  test('object, typings', () => {
  
    let source = getSource()
    let res = select(source, { a: 'a', bb: 'b'})({ d: 1 })
    // @ts-expect-error : props not in map
    res.nonexist
    // @ts-expect-error : props not in map
    res.b
    // @ts-expect-error : props not in map
    res.c
    res.d
    res.a
    res.bb
  
    // @ts-expect-error : props not in source
    let res2 = select(source, { a: 'nonexist' })({ d: 1 })
  })
})

