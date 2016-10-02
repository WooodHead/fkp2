src_dir = './public'
global_dir = './src/js/global'
path = require('path')
cfg = require('../config')()

module.exports = {
    name: "FCKJS"
    babel: false
    version: cfg.version
    description: "FKP-REST FRONT-END PART"
    port: {
        demo: 9000
        dev: 8070
    }
    dirs: {
      react: './react'
      src: src_dir
      dist: path.join __dirname, '../dist'
      pages: src_dir + "/js/pages"
      global: src_dir + "/js/global"
      vendor: "../libs/vendor"
      image: src_dir + "/images"
      css_common: src_dir + "css/modules/base"

      watch_src: src_dir
      watch_libs: './libs'
      watch_react: './component'
    }
    hash: false


    # // 以下配置，用于打包common.js，用于全局
    # // fkp的js分为两个部分，公共部分，业务部分
    # // 公共部分 common.js，如下列部分
    # // 业务部分，对应的js目录为 /public/src/pc/js/pages/.... 对应的文件


    # // react15, jq1.11
    vendorList: [
        # // [0]开发
        [
            path.join(__dirname, '../libs', '/vendor/jquery/dist/jquery.js'),
            path.join(__dirname, '../libs', '/vendor/react15/dist/react.js'),
            path.join(__dirname, '../libs', '/vendor/react15/dist/react-dom.js')
        ],

        # // [1]生产
        [
            path.join(__dirname, '../libs', '/vendor/jquery/dist/jquery.js'),
            path.join(__dirname, '../libs', '/vendor/react15/dist/react.js'),
            path.join(__dirname, '../libs', '/vendor/react15/dist/react-dom.js')
        ]
    ]



    # //react, zepto/jq2
    vendorList_adv: [
        # // [0]开发
        [
            path.join(__dirname, '../libs', '/vendor/jquery2/dist/jquery.js'),
            # // path.join(__dirname, '../libs', '/vendor/jquery3/jquery.min.js'),
            # // path.join(__dirname, '../libs', '/vendor/zepto/zepto.js'),

            # // react 0.13
            # // path.join(__dirname, '../libs', '/vendor/react/react-with-addons.js'),

            # // react 15
            path.join(__dirname, '../libs', '/vendor/react15/src/react.js'),
            path.join(__dirname, '../libs', '/vendor/react15/src/react-dom.js'),

            # // lodash 4.13.1
            path.join(__dirname, '../libs', '/vendor/lodash/src/lodash_full_413.js')
        ],

        # // [1]生产
        [
            path.join(__dirname, '../libs', '/vendor/jquery2/dist/jquery.min.js'),
            # // path.join(__dirname, '../libs', '/vendor/zepto/zepto.js'),

            # // react 0.13
            # // path.join(__dirname, '../libs', '/vendor/react/react-with-addons.js'),

            # // react 15
            path.join(__dirname, '../libs', '/vendor/react15/dist/react.min.js'),
            path.join(__dirname, '../libs', '/vendor/react15/dist/react-dom.min.js'),

            # // lodash 4.13.1
            path.join(__dirname, '../libs', '/vendor/lodash/dist/lodash_full_413.min.js')
        ]
    ]



    # //angular
    vendorList_ng: [
        [
            path.join(__dirname, '../libs', '/vendor/jquery/dist/jquery.js'),
            path.join(__dirname, '../libs', '/vendor/angular/angular.js')
        ],
        [
            path.join(__dirname, '../libs', '/vendor/jquery/dist/jquery.js'),
            path.join(__dirname, '../libs', '/vendor/angular/angular.js')
        ]
    ]




    # //backbone
    vendorList_bb: [
        [
            path.join(__dirname, '../libs', '/vendor/jquery2/dist/jquery.js'),
            path.join(__dirname, '../libs', '/vendor/lodash/src/lodash_full_413.js'),
            path.join(__dirname, '../libs', '/vendor/backbone/backbone.js')
        ],
        [
            path.join(__dirname, '../libs', '/vendor/jquery2/dist/jquery.js'),
            path.join(__dirname, '../libs', '/vendor/lodash/src/lodash_full_413.js'),
            path.join(__dirname, '../libs', '/vendor/backbone/backbone.js')
        ]
    ]



    # // ===================================================================


    # //libs/src/pc/global
    globalList: [
        path.join(__dirname, '../libs', '/vendor_custom/store.js'), #sax
        path.join(__dirname, '../libs', '/vendor_custom/config.js'), # sax
        # // path.join(__dirname, '../libs', '/js/global/libs.js'),
        # // path.join(__dirname, '../libs', '/js/global/core.js'),
        # // path.join(__dirname, '../libs', '/js/global/toolkits.js')
    ]




    # //ie
    ieRequireList: (() ->
        return [
            path.join(__dirname, '../libs', '/vendor/console-polyfill/polyfill.js'),
            path.join(__dirname, '../libs', '/vendor/html5shiv/dist/html5shiv.js'),
            path.join(__dirname, '../libs', '/vendor/respond/dest/respond.src.js'),
            path.join(__dirname, '../libs', '/vendor/es5-shim/es5-shim.js'),
            path.join(__dirname, '../libs', '/vendor/es5-shim/es5-sham.js'),
            path.join(__dirname, '../libs', '/vendor/json2/json2.js')
        ]
    )()


}
