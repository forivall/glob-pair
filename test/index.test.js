import test from 'ava'

import globPairs, {Walker, walk as globPair} from '../index'

const origDir = process.cwd()

test.beforeEach(() => {
  process.chdir(__dirname + "/fixtures")
})

test.after(() => {
  process.chdir(origDir)
})

test.cb('one file', t => {
  t.plan(3)
  globPair({src: ['a.scss'], dest: ['a.css']}, (src, dest) => {
    t.is(src, 'a.scss')
    t.is(dest, 'a.css')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('one file destext', t => {
  t.plan(3)
  globPair({src: ['a.scss'], dest: ['a.css'], destExt: '.css'}, (src, dest) => {
    t.is(src, 'a.scss')
    t.is(dest, 'a.css')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('one file destext 2', t => {
  t.plan(3)
  globPair({src: ['a.scss'], dest: ['a'], destExt: '.css'}, (src, dest) => {
    t.is(src, 'a.scss')
    t.is(dest, 'a.css')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.skip.cb('one file dir', t => {
  t.plan(3)
  globPair({src: ['a.scss'], dest: ['.'], destExt: '.css'}, (src, dest) => {
    t.is(src, 'a.scss')
    t.is(dest, 'a.css')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('one file glob', t => {
  t.plan(3)
  globPair({src: ['*.scss'], dest: ['.'], destExt: '.css'}, (src, dest) => {
    t.is(src, 'a.scss')
    t.is(dest, 'a.css')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('dir', t => {
  t.plan(3)
  globPair({src: ['lib'], dest: ['dist']}, (src, dest) => {
    t.is(src, 'lib/index.js')
    t.is(dest, 'dist/lib/index.js')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('dir into', t => {
  t.plan(3)
  globPair({src: ['src/*.jsx'], dest: ['lib'], destExt: '.js'}, (src, dest) => {
    t.is(src, 'src/index.jsx')
    t.is(dest, 'lib/index.js')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('dir into 2', t => {
  t.plan(5)
  const expected = {
    'src/index.jsx': 'lib/index.js',
    'src/foo/bar.jsx': 'lib/foo/bar.js'
  }
  globPair({src: ['src/*'], dest: ['lib'], destExt: '.js'}, (src, dest) => {
    t.ok(src in expected)
    t.is(dest, expected[src])
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('multi', t => {
  t.plan(5)
  const expected = {
    'src/index.jsx': 'lib/index.js',
    'src/foo/bar.jsx': 'lib/foo/bar.js'
  }
  globPair({src: ['src/*.jsx', 'src/foo/*.jsx'], dest: ['lib', 'lib/foo'], destExt: '.js'}, (src, dest) => {
    t.ok(src in expected)
    t.is(dest, expected[src])
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('collect', t => {
  t.plan(5)
  const expected = {
    'src/index.jsx': 'lib/index.js',
    'src/foo/bar.jsx': 'lib/foo/bar.js'
  }
  globPairs(
    {src: ['src/*.jsx', 'src/foo/*.jsx'], dest: ['lib', 'lib/foo'], destExt: '.js'},
    (err, results) => {
      t.notOk(err)
      for (let {src, dest} of results) {
        t.ok(src in expected)
        t.is(dest, expected[src])
      }
      t.end()
    }
  );
})

test.cb('empty dest', t => {
  t.plan(5)
  const expected = {
    'src/index.jsx': true,
    'src/foo/bar.jsx': true
  }
  globPairs(
    {src: ['src/*.jsx', 'src/foo/*.jsx'], dest: false, destExt: '.js'},
    (err, results) => {
      t.notOk(err)
      for (let result of results) {
        t.ok(result.src in expected)
        t.notOk("dest" in result)
      }
      t.end()
    }
  );
})

test.cb('empty dest dir', t => {
  t.plan(5)
  const expected = {
    'src/index.jsx': true,
    'src/foo/bar.jsx': true
  }
  globPair(
    {src: ['src'], dest: false, destExt: '.js'},
    (src, dest) => {
      t.ok(src in expected)
      t.is(dest, undefined)
    },
    (err) => {
      t.notOk(err)
      t.end()
    }
  );
})

test.serial.cb('leading parent dir', t => {
  process.chdir(__dirname + '/fixtures/src');
  t.plan(3)
  globPair({src: ['../lib'], dest: ['dist']}, (src, dest) => {
    t.is(src, '../lib/index.js')
    t.is(dest, 'dist/lib/index.js')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.serial.cb('leading parent dirs', t => {
  process.chdir(__dirname + '/fixtures/src/foo');
  t.plan(3)
  globPair({src: ['../../lib'], dest: ['dist']}, (src, dest) => {
    t.is(src, '../../lib/index.js')
    t.is(dest, 'dist/lib/index.js')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.serial.cb('cwd opt', t => {
  process.chdir(__dirname)
  t.plan(3)
  globPair({cwd: 'fixtures', src: ['a.scss'], dest: ['a.css']}, (src, dest) => {
    t.is(src, 'a.scss')
    t.is(dest, 'a.css')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.serial.cb('root opt', t => {
  process.chdir(__dirname)
  t.plan(3)
  globPair({root: 'fixtures', src: ['a.scss'], dest: ['a.css']}, (src, dest) => {
    t.is(src, 'a.scss')
    t.is(dest, 'a.css')
  }, (err) => {
    t.notOk(err)
    t.end()
  })
})

test.cb('reentrant err', t => {
  t.plan(1)
  let n = 0;
  let w = new Walker({}, (src, dest) => {
  }, (err) => {
    n++
    if (n === 2) t.end()
  })
  w.walk({src: ['a.scss'], dest: ['a.css']})
  // using "t.throws" makes coverage test fail
  try {
    w.walk({src: ['b.scss'], dest: ['b.css']})
  } catch (e) {
    t.is(e.message, "Not reentrant")
  }
  t.end()
})

test.cb('abort', t => {
  t.plan(1)
  globPair({src: ['lib'], dest: ['dist']}, (src, dest) => {
    t.is(src, 'lib/index.js')
    t.is(dest, 'dist/lib/index.js')
  }, (err) => {
    t.ok(err)
    t.end()
  }).abort(new Error("manually aborted"))
})
