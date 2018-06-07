import test from 'ava'
import {modCursor} from './utils'

test('modCursor', t => {
  t.is(modCursor(0.9, 7), -6.1)
  t.is(modCursor(0, 7), 0)
  t.is(modCursor(-1, 7), -1)
  t.is(modCursor(-6.2, 7), -6.2)
  t.is(modCursor(-7, 7), 0)
})
