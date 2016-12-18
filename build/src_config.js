let path = require('path')
let src_dir = path.join(__dirname, '../public')
let version = require('../package.json').version||'1.0.0'
let nodePort = require('../config')().port||8070

module.exports = {
  name: "FCKJS",
  babel: true,
  version: version,
  description: "FKP2 SLIME SCAFFOLD",
  ports: {
      dev: 8060,
      node: nodePort,
  },
  dirs: {
    src: src_dir,
    dist: path.join (__dirname, '../dist'),
    server: path.join (__dirname, '../server'),
    pages: src_dir + "/js/pages",
    global: src_dir + "/js/global",
    vendor: "../libs/vendor",
    image: src_dir + "/images",
    watch_src: src_dir,
    watch_libs: './libs',
    watch_react: './component'
  },
  hash: false,
  delay: {
    openBrowse: 7000,
  },

  // 以下配置，生成common.js，全局
  // gulp-task/concat-common-js.coffee
  vendorList_adv: [
    // [0]开发
    [ path.join(__dirname, '../libs', '/vendor/jquery2/dist/jquery.js'),
      path.join(__dirname, '../libs', '/vendor/react15/src/react.js'),
      path.join(__dirname, '../libs', '/vendor/react15/src/react-dom.js'),
      path.join(__dirname, '../libs', '/vendor/lodash/src/lodash_full_413.js')
    ],
    // [1]生产
    [ path.join(__dirname, '../libs', '/vendor/jquery2/dist/jquery.min.js'),
      path.join(__dirname, '../libs', '/vendor/react15/dist/react.min.js'),
      path.join(__dirname, '../libs', '/vendor/react15/dist/react-dom.min.js'),
      path.join(__dirname, '../libs', '/vendor/lodash/dist/lodash_full_413.min.js')
    ]
  ],

  //  ===================================================================
  // 自定义
  globalList: [
    path.join(__dirname, '../libs', '/vendor_custom/store.js'), //sax
    path.join(__dirname, '../libs', '/vendor_custom/config.js')
  ],

  // ie polyfill
  ieRequireList: [
    path.join(__dirname, '../libs', '/vendor/console-polyfill/polyfill.js'),
    path.join(__dirname, '../libs', '/vendor/html5shiv/dist/html5shiv.js'),
    path.join(__dirname, '../libs', '/vendor/respond/dest/respond.src.js'),
    path.join(__dirname, '../libs', '/vendor/es5-shim/es5-shim.js'),
    path.join(__dirname, '../libs', '/vendor/es5-shim/es5-sham.js'),
    path.join(__dirname, '../libs', '/vendor/json2/json2.js')
  ]
}
