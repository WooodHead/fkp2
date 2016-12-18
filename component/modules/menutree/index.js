var MenuTree = require('./_menutree/index');

export function menuTree(props){
  let Component =  MenuTree()
  return <Component {...props} />
}

export function pure(props){
  let Component =  MenuTree()
  return <Component {...props} />
}

/*
{
  "data": {
    "root": {
      "group": "root",
      "caption": "root",
      "list": [
        {
          "url": "/docs/fkpdoc/log",
          "ipurl": "",
          "group": "root",
          "title": "FKP日志-2.15.14",
          "stat": "",
          "fileName": "log.md",
          "fullpath": "fdocs/fkpdoc/log.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/menv",
          "ipurl": "",
          "group": "root",
          "title": "FKPJS多环境支持",
          "stat": "",
          "fileName": "menv.md",
          "fullpath": "fdocs/fkpdoc/menv.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "root",
      "children": [
        "FKPJS",
        "FKPRN",
        "demo"
      ],
      "subtree": "fdocs/fkpdoc/demo"
    },
    "FKPJS": {
      "group": "FKPJS",
      "caption": "FKPJS",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/10summary",
          "ipurl": "",
          "group": "FKPJS",
          "title": "概述",
          "stat": "",
          "fileName": "10summary.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/10summary.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/duplicate",
          "ipurl": "",
          "group": "FKPJS",
          "title": "注意特殊的名字",
          "stat": "",
          "fileName": "duplicate.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/duplicate.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "root",
      "children": [
        "10Start",
        "Core",
        "Front",
        "Node"
      ],
      "subtree": "fdocs/fkpdoc/FKPJS/Node"
    },
    "10Start": {
      "group": "10Start",
      "caption": "10Start",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/10Start/12struct",
          "ipurl": "",
          "group": "10Start",
          "title": "FKPJS结构图",
          "stat": "",
          "fileName": "12struct.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/10Start/12struct.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/10Start/14install",
          "ipurl": "",
          "group": "10Start",
          "title": "FKP的安装",
          "stat": "",
          "fileName": "14install.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/10Start/14install.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/10Start/20wherehtml",
          "ipurl": "",
          "group": "10Start",
          "title": "HTML写在哪里",
          "stat": "",
          "fileName": "20wherehtml.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/10Start/20wherehtml.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/10Start/30wherecss",
          "ipurl": "",
          "group": "10Start",
          "title": "CSS写在哪里",
          "stat": "",
          "fileName": "30wherecss.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/10Start/30wherecss.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/10Start/31wherejs",
          "ipurl": "",
          "group": "10Start",
          "title": "JAVASCRIPT写哪里",
          "stat": "",
          "fileName": "31wherejs.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/10Start/31wherejs.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/10Start/40kaishi",
          "ipurl": "",
          "group": "10Start",
          "title": "启动模式",
          "stat": "",
          "fileName": "40kaishi.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/10Start/40kaishi.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "FKPJS",
      "children": [],
      "subtree": true
    },
    "Core": {
      "group": "Core",
      "caption": "Core",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/Core/sax",
          "ipurl": "",
          "group": "Core",
          "title": "FKP-SAX",
          "stat": "",
          "fileName": "sax.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Core/sax.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "FKPJS",
      "children": [],
      "subtree": true
    },
    "Front": {
      "group": "Front",
      "caption": "Front",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/Front/api",
          "ipurl": "",
          "group": "Front",
          "title": "FKP的ajax请求",
          "stat": "",
          "fileName": "api.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/api.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/pages",
          "ipurl": "",
          "group": "Front",
          "title": "pages",
          "stat": "",
          "fileName": "pages.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/pages.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/upload",
          "ipurl": "",
          "group": "Front",
          "title": "ueditor的集成",
          "stat": "",
          "fileName": "upload.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/upload.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "FKPJS",
      "children": [
        "F-modules"
      ],
      "subtree": "fdocs/fkpdoc/FKPJS/Front/F-modules"
    },
    "F-modules": {
      "group": "F-modules",
      "caption": "F-modules",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/form",
          "ipurl": "",
          "group": "F-modules",
          "title": "From表单",
          "stat": "",
          "fileName": "form.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/form.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/list",
          "ipurl": "",
          "group": "F-modules",
          "title": "列表组件",
          "stat": "",
          "fileName": "list.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/list.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/menutree",
          "ipurl": "",
          "group": "F-modules",
          "title": "树形菜单-前端",
          "stat": "",
          "fileName": "menutree.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/menutree.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/pagination",
          "ipurl": "",
          "group": "F-modules",
          "title": "分页组件",
          "stat": "",
          "fileName": "pagination.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/pagination.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/router",
          "ipurl": "",
          "group": "F-modules",
          "title": "前端路由",
          "stat": "",
          "fileName": "router.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/router.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/tabs",
          "ipurl": "",
          "group": "F-modules",
          "title": "Tabs组件",
          "stat": "",
          "fileName": "tabs.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/tabs.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/websocket",
          "ipurl": "",
          "group": "F-modules",
          "title": "Websocket",
          "stat": "",
          "fileName": "websocket.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/websocket.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "Front",
      "children": [
        "F-libs"
      ],
      "subtree": "fdocs/fkpdoc/FKPJS/Front/F-modules/F-libs"
    },
    "F-libs": {
      "group": "F-libs",
      "caption": "F-libs",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/Front/F-modules/F-libs/validate",
          "ipurl": "",
          "group": "F-libs",
          "title": "Form表单校验模块",
          "stat": "",
          "fileName": "validate.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Front/F-modules/F-libs/validate.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "F-modules",
      "children": [],
      "subtree": true
    },
    "Node": {
      "group": "Node",
      "caption": "Node",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/Node/auto",
          "ipurl": "",
          "group": "Node",
          "title": "自动化部署FKP到linux服务器",
          "stat": "",
          "fileName": "auto.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/auto.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/menv",
          "ipurl": "",
          "group": "Node",
          "title": "FKPJS多环境支持",
          "stat": "",
          "fileName": "menv.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/menv.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/pages",
          "ipurl": "",
          "group": "Node",
          "title": "pages",
          "stat": "",
          "fileName": "pages.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/pages.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "FKPJS",
      "children": [
        "N-modules"
      ],
      "subtree": "fdocs/fkpdoc/FKPJS/Node/N-modules"
    },
    "N-modules": {
      "group": "N-modules",
      "caption": "N-modules",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/cache",
          "ipurl": "",
          "group": "N-modules",
          "title": "Cache",
          "stat": "",
          "fileName": "cache.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/cache.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/list",
          "ipurl": "",
          "group": "N-modules",
          "title": "列表组件",
          "stat": "",
          "fileName": "list.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/list.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/menutree",
          "ipurl": "",
          "group": "N-modules",
          "title": "树形菜单-node端",
          "stat": "",
          "fileName": "menutree.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/menutree.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/pagination",
          "ipurl": "",
          "group": "N-modules",
          "title": "分页组件",
          "stat": "",
          "fileName": "pagination.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/pagination.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/request",
          "ipurl": "",
          "group": "N-modules",
          "title": "Request",
          "stat": "",
          "fileName": "request.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/request.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/router",
          "ipurl": "",
          "group": "N-modules",
          "title": "路由",
          "stat": "",
          "fileName": "router.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/router.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/tabs",
          "ipurl": "",
          "group": "N-modules",
          "title": "Tabs组件",
          "stat": "",
          "fileName": "tabs.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/tabs.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/websocket",
          "ipurl": "",
          "group": "N-modules",
          "title": "Websocket",
          "stat": "",
          "fileName": "websocket.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/websocket.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "Node",
      "children": [
        "N-libs"
      ],
      "subtree": "fdocs/fkpdoc/FKPJS/Node/N-modules/N-libs"
    },
    "N-libs": {
      "group": "N-libs",
      "caption": "N-libs",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPJS/Node/N-modules/N-libs/validate",
          "ipurl": "",
          "group": "N-libs",
          "title": "Form表单校验模块",
          "stat": "",
          "fileName": "validate.md",
          "fullpath": "fdocs/fkpdoc/FKPJS/Node/N-modules/N-libs/validate.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "N-modules",
      "children": [],
      "subtree": true
    },
    "FKPRN": {
      "group": "FKPRN",
      "caption": "FKPRN",
      "list": [
        {
          "url": "/docs/fkpdoc/FKPRN/fkprn",
          "ipurl": "",
          "group": "FKPRN",
          "title": "FKP-REACT-NATIVE",
          "stat": "",
          "fileName": "fkprn.md",
          "fullpath": "fdocs/fkpdoc/FKPRN/fkprn.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/FKPRN/router",
          "ipurl": "",
          "group": "FKPRN",
          "title": "fkp-react-native-router",
          "stat": "",
          "fileName": "router.md",
          "fullpath": "fdocs/fkpdoc/FKPRN/router.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "root",
      "children": []
    },
    "demo": {
      "group": "demo",
      "caption": "demo",
      "list": [
        {
          "url": "/docs/fkpdoc/demo/chat",
          "ipurl": "",
          "group": "demo",
          "title": "websocket chat实例(前端)",
          "stat": "",
          "fileName": "chat.md",
          "fullpath": "fdocs/fkpdoc/demo/chat.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/demo/chat1",
          "ipurl": "",
          "group": "demo",
          "title": "websocket chat实例(node篇)",
          "stat": "",
          "fileName": "chat1.md",
          "fullpath": "fdocs/fkpdoc/demo/chat1.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/demo/fordoc",
          "ipurl": "",
          "group": "demo",
          "title": "简单的文档系统",
          "stat": "",
          "fileName": "fordoc.md",
          "fullpath": "fdocs/fkpdoc/demo/fordoc.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        },
        {
          "url": "/docs/fkpdoc/demo/helloworld",
          "ipurl": "",
          "group": "demo",
          "title": "一个实例，Hello World",
          "stat": "",
          "fileName": "helloworld.md",
          "fullpath": "fdocs/fkpdoc/demo/helloworld.md",
          "des": "",
          "mdname": "",
          "ctime": "2016-10-27T08:12:54.000Z",
          "birthtime": "2016-10-27T08:12:54.000Z"
        }
      ],
      "parent": "root",
      "children": []
    }
  }
}

*/
