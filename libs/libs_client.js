var base = require('./_component/base')
var doc = require('./_component/doc')
var timer = require('./_component/time')
var forapp = require('./_component/forapp')
// var base_tips = require('./_component/tips')

module.exports = {
    guid:           base.guid,           //生成随机名字
    $class:         base.$class,          //创建类，并执行this.init方法
    strLen:         base.strLen,         //获取字符串长度，包含中文
    json2url:       base.json2url,       //json转成url的query部分
    grabString:     base.grabString,     //截取字符串长度，包含中文
    arg2arr:        base.arg2arr,        //类数组对象转成数组
    getObjType:     base.getObjType,     //获取对象类型
    objtypeof:      base.getObjType,     //获取对象类型
    inherits:       base.inherits,

    os:             doc.os,             //获取手机操作系统类型，如android或者ios
    getOffset:      doc.getOffset,      //取得元素的绝对位置
    offset:         doc.getOffset,      //取得元素的绝对位置
    DocmentView:    doc.DocmentView,    //取得当前浏览区域的宽、高
    view:           doc.DocmentView,    //取得当前浏览区域的宽、高
    scrollView:     doc.scrollView,    //取得当前浏览区域的宽、高
    node:           doc.node,           //兼容性原生 DOM操作，目前只有删除DOM
    addEvent:       doc.addEvent,       //兼容性绑定方法
    rmvEvent:       doc.rmvEvent,       //兼容性删除方法
    getElementsByClassName: doc.getElementsByClassName,
    replaceState:   doc.replaceState,   // 替换location.href并不切换页面
    preventDefault: doc.preventDefault,

    inject:         doc.inject,          // 注入css和js
    // addSheet:       doc.addSheet,        // 动态注入 CSS---兼容旧版语法方法
    urlparse:       doc.urlparse,        // url地址解析
    _IE:            doc.ie,              // 输出IE版本
    queryString:    doc.queryString,
    queryParams:    doc.queryParams,
    currentStyle:   doc.currentStyle,    //获取dom属性，兼容写法
    insertCaret:    doc.insertCaret,     //一般用在编辑器中的iframe插入数据
    portrait:       doc.portrait,         // 强制竖屏
    mediaQuery:     doc.mediaQuery,       // 移动端/平板/pc

    isSupportFixed: forapp.isSupportFixed,
    changeTitle:    forapp.changeTitle,     //ios特有bug解决方法，改变title

    countDown:      timer.countDown,    //倒计时
    timeAgo:        timer.timeAgo,      //时间过去了多久
    getTs:          forapp.getTs,        // "2010-03-15 10:30:00"转时间戳

    // msgtips:        require('component/modules/msgtips'),
    // msgtips:        base_tips.tips,
    // poper:          base_tips,

    smd:            require('./_component/simplemd'),   //简单markdown

    validator:     require('./_component/validator')        //校验基础方法

}
