

function assertString(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Validates strings only');
  }
}

function isCreditCard(str){
  const creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|62[0-9]{14}$/;
  assertString(str);
  const sanitized = str.replace(/[^0-9]+/g, '');
  if (!creditCard.test(sanitized)) {
    return false;
  }
  let sum = 0;
  let digit;
  let tmpNum;
  let shouldDouble;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, (i + 1));
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += ((tmpNum % 10) + 1);
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!((sum % 10) === 0 ? sanitized : false);
}

function isEmpty(str) {
  assertString(str);
  return str.length === 0;
}

function $$(id){
  return document.getElementById(id)
}

// function password(passwd, reg){
//   var tmp = true;
//   val = passwd;
//   //level  0  1  2  3  4  password stronger
//   level = (val.length>5) ? 0 + (val.length>7) + (/[a-z]/.test(val) && /[A-Z]/.test(val)) + (/\d/.test(val) && /\D/.test(val)) + (/\W/.test(val) && /\w/.test(val)) + (val.length > 12) : 0;
//   if(val.length>20||/\s/.test(val)) level=0; //不包括空格
//   return level;
// }

// \u4e00-\u9fa5\uFE30-\uFFA0\ 中文及中文符号
var block = {
  email    : /^[\.a-zA-Z0-9_=-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  username : /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,}$/,
  verify   : /^[a-z\d]{4}$/i,
  verify_d : /^[\d]{4}$/i,
  verify_m : /^[\d]{6}$/,
  // password : /^(?=.{5,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/,//密码
  password : /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,}$/,//密码
  guhua    : /^(\d{3,4})?[-]?\d{7,8}$/,//电话号码的格式
  mobile   : /^(\+?0?86\-?)?1[345789]\d{9}$/, //手机
  url      : /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-.\/?%&=]*)?$/, //url
  ip4      : /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/, //ip地址
  isEmpty  : isEmpty,
  qq       : /^[1-9]*[1-9][0-9]*$/, //QQ号码
  idcard   : /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/, //身份证
  birthday : /^(\d{4})[\.-](\d{1,2})[\.-](\d{1,2})$/,
  money    : /^[\d]{1,8}(\.\d{1,2})?$/,
  all      : /[\s\S]/,
  tips     : function(msg){ console.log(msg) },
  noop     : function(){ return true },
  isAscii  : function(str){
    assertString(str)
    var ascii = /^[\x00-\x7F]+$/;
    return ascii.test(str);
  },
  isBase64 : function(str){
    assertString(str)
    var notBase64 = /[^A-Z0-9+\/=]/i;
    var len = str.length;
    if (!len || len % 4 !== 0 || notBase64.test(str)) {
      return false;
    }
    var firstPaddingChar = str.indexOf('=');
    return firstPaddingChar === -1 ||
      firstPaddingChar === len - 1 ||
      (firstPaddingChar === len - 2 && str[len - 1] === '=');
  },
  isCreditCard: isCreditCard
}

var errs = {
  "100": ['必须指定检测类型', block],
  "110": '指定id的dom对象不存在',
  "120": {msg: ''},
  "130": {msg: ''},
  "140": {msg: ''},
  "username": "用户名不正确",
  "mobile": "手机号码不正确",
  email: "邮箱地址不正确",
  verify: "验证码不正确",
  verify_m: "验证码不正确",
  password: "请正确输入密码，匹配6位以上及包含大小写及数字",
  url: "url地址不正确",
  ip4: "ip地址不正确",
  qq: "qq地址不正确",
}

//匹配
function check(val, reg, block){
  var result = (!val)
    ? false
    : typeof block[reg] === 'function'
      ? block[reg](val)
      : block[reg].test(val)
    return result
}

/**
* form表单校验
* form_valide be dependent SAX, SAX is a global function
  SAX like localstorage, but more. SAX.set like .setItem, .get like .getItem
  you must special @name, @name is one of SAX's param
  use SAX.get(@name), then you get the data of @name
  use SAX.set(@name, [JSON/String/Array]) will set value of @name in browse memery

* @name  {String}  special SAX name for stroe

* SAMPLE
* form_valide(name)
             @id {String}     dom element's id
             @type {String}     regular's type
             @callback  {Function}     custom function to regular your self
             (id, type, [callback])   -->   it's a function
             -----------------------------------
             ('user', 'username', [cb])    -->   it's a function
             ('telephone', 'mobile', [cb])
             ('comment', 'notempty', [cb])
             ('code', 'verify', [cb])

   @stat {Boolean}   //@stat is resault of regular.test(value)
   @block {Object}

   cb = function(stat, block){
        //this is form-element of you special id
   }

   valide('Form_bind')
         ('mobile', 'noop', function(res, old){ ... })   //res是noop的检测结果, old为默认正则的检测类型
         ('validatecode', 'verify')
         ("agreement", 'noop')
*/

function form_valide(opts) {
  if (_.isPlainObject(opts)) block = _.merge(block, opts)
  var ckstat=true
  , ii = 0
  , resault
  , element = {}
  , args = {}
  , nblock
  , _noop = function(){}
  , _query = {}
  , query = {
    stat: true
  }
  nblock = _.merge({}, block)

  function validator(value, reg, cb){
    if (!arguments.length) {
      ii = 0
      query = { stat: true }
      return ckstat
    }

    if (typeof value == 'function') {
      ii = 0
      ckstat = true
      var _fun = value
        , _errs = []
      Object.keys(query).map(function(item, jj){
        if (!query[item] && item!='stat') {
          ckstat = false
          var tmp = {}
          tmp.key = args[jj]
          tmp.info = errs[args[jj]]
          _errs.push(tmp)
        }
      })
      query.stat = ckstat;
      const $query = JSON.parse(JSON.stringify(query))
      query = { stat: true }
      return _fun($query, _errs)
    }

    if (!reg || !nblock[reg]) {
      if (typeof cb != 'function') return errs['100']
    }

    args[ii] = reg

    if (typeof cb == 'function') {
      var cb_result = cb(value, nblock, errs)
      ckstat = cb_result
    } else {
      ckstat = check(value, reg, nblock)
    }
    query[ii] = ckstat
    ii++
    return validator
  }
  return validator
}

module.exports = form_valide
