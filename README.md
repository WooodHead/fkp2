# 概述
> It's a full stack project, FKP means `full stack plus`，大前端框架  

## About
Using the following technologies:  

* [KOA2](https://github.com/koajs/koa)
* [React](https://github.com/facebook/react)
* [Babel](https://github.com/babel/babel)
* [Mongo](https://github.com/mongodb/mongo)
* [Mongoose](https://github.com/Automattic/mongoose)
* [Webpack](http://webpack.github.io) for bundling
* [GULP](https://github.com/gulpjs/gulp) for bundling
* [Nodemon](https://github.com/remy/nodemon)
* [browser-sync](https://github.com/BrowserSync/browser-sync) for bundling
* [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware) for bundling
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
* ... more  

## Feather  
1. Build system  
  * Modular design/模块化设计
  * Dev model/开发模式，实时watch node/js/css/html
  * Prod mode/生产模式，uglify/hash
  * 多环境支持，应对test/release/pre prod/prod线上环境
  * SPA 支持单页应用
  * MPA 支持多页应用
  * 映射型静态文件，无需手动配置入口编译文件
  * 多层次结构文件/目录生成
  * 支持忽略文件/目录
  * HTML/Handbars
  * Babel/Coffee
  * LESS/STYLUS
  * 雪碧图自动生成
  * 版本生成，支持回滚
2. Node
  * KOA2
  * React
  * MongoDB
  * Mirror/Static Router
  * Lru Catch
  * API/MOCK
  * Websocket
  * FKP Moudel
  * FKP-SAX
  * SYNC Component
  * SYNC Libs
  * Lodash   
  * Inject CSS/JS 静态文件注入，生产环境带hash
3. FED
  * React
  * Websocket   
  * Mapper Static File/映射静态文件
  * SYNC Component
  * SYNC Libs
  * FKP-ROUTER
  * FKP-SAX
  * Lodash
  * Runtime Inject CSS/JS 静态文件注入，生产环境带hash   
4. 适用于PC/移动端，common.js gizp后~180k，含React/lodash/immutable/jquery2
5. FED/NODE 支持import/require路径aliase化，引入文件简单，无需`../../../`

## Build
Include 3 mode and 4 commond  
包含该三种模式和4个命令  
1. ly demo -- with watch, only static file, like `HTML/CSS/JAVASCRIPT`  
2. **ly dev -- with watch, node and static file**   
3. ly pro --  with watch/uglify/hash, node and static file, but watch is not good   
4. gulp build -- with uglify/hash, like `gulp pro` but no watch, it used in production environment    

Pls note that `ly` is a executable bash file that in root directory. it encapsulated `GULP` and ...   
`ly`是执行文件，`windows/linux/mac`下要注意给执行权限  

In development mode, will watch `CSS/JAVASCRIPT/HTML/NODEJS` file, and timely response on browser  
开发模式下，watch `CSS/JAVASCRIPT/HTML/NODEJS` 这些文件，会快速响应到浏览器上，方便开发， 提升开发效率  

![fkpjs.png](http://www.agzgz.com/uploader/web-911000945015718614776488827802026.png)

## Component  
Component that can be used in the node-end and front-end that based on React  
同构组件，可以在`node/FED`端使用同一套组件  

Here are some sync component that can be used in `node/FED`:  
适用`node/FED`
* list
* tabs
* trees
* form
* cards
* grids
* pagination
* ...

Here are some FED component:  
适用`FED`  

* slider
* sticky
* slip
* upload
* msgtips
* modal


## Markdwon management system  
In root directory, create a new directory with named `fdocs` that is a gitignore directory. then put some `Markdown file/directory` in `fdocs`  
`fdocs`在根目录下，是git忽略目录，新建并拖入md文件/目录  

With `http://localhost:3000/docs` URL that can be visited  
运行后通过`http://localhost:3000/docs`访问  

#### [Demo](http://www.agzgz.com/docs/fkpdoc)  



## Blog
it's a simple blog, with github authorization and mongodb  

Make sure that mongo has been running normally, and config it at `config.js` in root directory  
确保mongo正常运行，配置项在根目录下的`config.js`文件中  

#### [Demo](http://www.agzgz.com/blog)  


## Install and Start  

Download or clone it  
support `nodejs >= 6.4`
need global variable `GULP/NODEMON/node-pre-gyp`  

    npm i
    ly dev

All is fine in my `Mac pro` and my server `Debian 7`  

Good luck
