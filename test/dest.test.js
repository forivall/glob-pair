import test from 'ava'

import globDest from '../lib/dest'


test('one file', t => {
  t.is(globDest('a.scss', {src: ['a.scss'], dest: ['a.css']}), 'a.css')
})

test('one file destext', t => {
  t.is(globDest('a.scss', {src: ['a.scss'], dest: ['a.css'], destExt: '.css'}), 'a.css')
})

test('one file destext 2', t => {
  t.is(globDest('a.scss', {src: ['a.scss'], dest: ['a'], destExt: '.css'}), 'a.css')
})

test.skip('one file dir', t => {
  t.is(globDest('a.scss', {src: ['a.scss'], dest: ['.'], destExt: '.css'}), 'a.css')
})

test('one file glob', t => {
  t.is(globDest('a.scss', {src: ['*.scss'], dest: ['.'], destExt: '.css'}), 'a.css')
})

test('dir', t => {
  t.is(globDest('lib/index.js', {src: ['lib'], dest: ['dist']}), 'dist/lib/index.js')
})

test('dir into', t => {
  t.is(globDest('src/index.jsx', {src: ['src/*.jsx'], dest: ['lib'], destExt: '.js'}), 'lib/index.js')
})

test('dir into 2', t => {
  const pat = {src: ['src/*'], dest: ['lib'], destExt: '.js'}
  t.is(globDest('src/index.jsx', pat), 'lib/index.js',)
  t.is(globDest('src/foo/bar.jsx', pat), 'lib/foo/bar.js')
})

test('multi', t => {
  const pat = {src: ['src/*.jsx', 'src/foo/*.jsx'], dest: ['lib', 'lib/foo'], destExt: '.js'}
  t.is(globDest('src/index.jsx', pat), 'lib/index.js',)
  t.is(globDest('src/foo/bar.jsx', pat), 'lib/foo/bar.js')
})

test('leading parent dir', t => {
  t.is(globDest('../lib/index.js', {src: ['../lib'], dest: ['dist']}), 'dist/lib/index.js')
})

test('leading parent dirs', t => {
  t.is(globDest('../../lib/index.js', {src: ['../../lib'], dest: ['dist']}), 'dist/lib/index.js')
})


test('fail', t => {
  const pat = {src: ['foo'], dest: ['.'], destExt: '.js'}
  t.is(globDest('src/index.jsx', pat), false)
})

test('neg', t => {
  const pat = {src: ['!foo'], dest: ['.'], destExt: '.js'}
  t.is(globDest('src/index.jsx', pat), 'src/index.js')
})

test('neg fail', t => {
  const pat = {src: ['!index.jsx'], dest: ['.']}
  t.is(globDest('index.jsx', pat), false)
})

test('comment', t => {
  const pat = {src: ['#foo'], dest: ['.']}
  t.is(globDest('src/index.jsx', pat), false)
})

test('empty', t => {
  const pat = {src: [''], dest: ['.'], destExt: '.js'}
  t.is(globDest('src/index.jsx', pat), 'src/index.js')
})
