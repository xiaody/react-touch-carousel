import test from 'ava'
import {omit, modCursor} from './utils'

test('omit', t => {
  t.deepEqual(omit({a: 'a', b: 'b'}, ['b']), {a: 'a'})
  t.deepEqual(omit({a: 'a', b: 'b'}, ['c']), {a: 'a', b: 'b'})
  t.deepEqual(omit({a: 'a', b: 'b'}, ['a', 'b']), {})
})

test('modCursor', t => {
  t.is(modCursor(0.9, 7), -6.1)
  t.is(modCursor(0, 7), 0)
  t.is(modCursor(-1, 7), -1)
  t.is(modCursor(-6.2, 7), -6.2)
  t.is(modCursor(-7, 7), 0)
})
