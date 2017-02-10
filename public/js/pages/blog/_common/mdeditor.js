import {input as Input} from 'component'
import { tips as msgtips, modal } from 'component/client'
import { inject, insertCaret, validator, strLen, mediaQuery, queryString, queryParams } from 'libs'
import injectStatic from './injectStatic'
let Modal = modal.p40
const query = queryString()
const params = queryParams('/blog')
const Validator = validator()



// 登录html结构
const formAsset = [
  ':---请登录后使用',
  { input: <input type='text' id='username' placehold="username/email" value='' />, title: '用户名：' },
  { input: <input type='password' id='password' value='' />, title: "密码：" },
  { input: <input type='button' id='login' value='登录' />, title: ' ' }
]

let loginFormStructor = Input({
  autoinjec: false,
  data: formAsset,
  rendered: loginFormAction
})

function chkUsername(value, block, errmsg){
  return value && value.length && block.username.test(value)
}

function loginFormAction(){
  const form = loginFormStructor
  $('#username').blur(function(){
    let stat = Validator(this.value, 'username', chkUsername)()
    if (!stat) form.warning('username')
    else form.warning('username','no')
  })

  $('#password').blur(function(){
    let stat = Validator(this.value, 'password')()
    if (!stat) form.warning('password')
    else form.warning('password','no')
  })

  $('#login').click(()=>{
    let values = form.values()
    let chk = Validator
      (values.username, 'username', chkUsername)
      (values.password, 'password')
      ((query, errs)=>{
        if (errs.length) {
          errs.map( item => {
            switch (item.key) {
              case 'username':
                form.warning('username')
              break;
              case 'password':
                form.warning('password')
              break;
            }
            msgtips.error(item.info)
          })
        } else {
          // login
        }
      })
  })
}

export default function(){
  if (document.getElementById('epiceditor')) {
    injectStatic(initEpicEditor)
  }
}

function initEpicEditor(options, webup){
  if (!window._epic_ed){
    // 编辑器初始化
    var opts = {
      container: 'epiceditor',
      textarea: null,
      basePath: '/js/t/epic',
      clientSideStorage: true,
      localStorageName: 'epiceditor',
      useNativeFullscreen: true,
      parser: marked,
      file: {
        name: 'epiceditor',
        defaultContent: '',
        autoSave: 100
      },
      theme: {
        base: '/themes/base/epiceditor.css',
        preview: '/themes/preview/github.css',
        editor: '/themes/editor/epic-light.css'
      },
      button: {
        preview: true,
        fullscreen: false,
        bar: "show"
      },
      focusOnLoad: false,
      shortcut: {
        modifier: 18,
        fullscreen: 70,
        preview: 80
      },
      string: {
        togglePreview: 'Toggle Preview Mode',
        toggleEdit: 'Toggle Edit Mode',
        toggleFullscreen: 'Enter Fullscreen'
      },
      autogrow: false
    }

    var editor = new EpicEditor(opts).load()
    mediaQuery({
      mobile: function(){
        editor.edit()
        Modal = modal.p80
      }
    })
    editor.reflow()

    var find = function(name){
      return editor.getElement(name);
    }

    var ed = {
      editor: editor,
      find: find
    }
    window._epic_ed = ed
    dealWithEditor.call(ed, options, webup)
  } else {
    dealWithEditor.call(window._epic_ed, options, webup)
  }
}


//编辑器处理
function dealWithEditor(options, webuploader){
  var stat_editor = 'add';
  var editor = this.editor;
  var find = this.find;

  var utilbar = $(find('epiceditor-utilbar'));  //工具栏
  var ed = $(find('editor'))
  var wrap = $(find('editorIframe'))
  var wraper = $(find('wrapper'))
  if (options && options.content && options._id){
    stat_editor = 'edit'
    editor.open(' ')
    // editor.importFile('_tmp',options.content)
  }

  // 编辑器上传
  editor.uploader(function(btn){
    webuploader.custom(function(){
      var that = this
      $(btn).click(function(){
        that.trigger('upfile')
      })
    }, function(file, ret){
      editor.emit('uploader', '!['+file.name+'](/uploader/'+ret.message+')')
    })
  })

  // 是否登录，激活按钮
  ajax.get('/auth/isLogin')
  .then( data => {
    if (!data.error) {
      if (params.cat == 'edit') {
        query.topic ? editArticle(utilbar, editor) : ''
      } else {
        newArticle(utilbar, editor)
      }
    } else {
      modalForLogin(utilbar, editor)
    }
  })
}

function newArticle(utilbar, editor){
  editor.open('clear')
  $(utilbar).find('.md-save').addClass('enable') .off('click')
  .on('click', () => {
    let cnt = JSON.parse(editor.exportFile(null, 'json'))
    if (cnt.content && strLen(cnt.content)>30) {
      savePost(cnt)
    } else {
      msgtips.warning('文章字数需要30字以上')
    }
  })
}

async function editArticle(utilbar, editor){
  const detail = await ajax.get('/blog/get', {topic: query.topic})
  editor.importFile('_tmp', detail.mdcontent.profile.src)

  $(utilbar).find('.md-save').addClass('enable') .off('click')
  .on('click', () => {
    var cnt = JSON.parse(editor.exportFile(null, 'json'))
    // console.log(cnt);
    cnt.id = query.topic
    if (cnt.content && strLen(cnt.content)>30) {
      savePost(cnt)
    } else {
      msgtips.warning('文章字数需要30字以上')
    }
  })
}

function modalForLogin(utilbar, editor){
  $(utilbar).find('.md-save') .off('click')
  .on('click', () => {
    Modal(
      <div style={{textAlign: 'left'}}>
        <div>{loginFormStructor.render()}</div>
        <div>
          <p>第三方登录</p>
          <ul className="logo">
            <li>
              <a className='github' href='/auth/sign'></a>
            </li>
          </ul>
        </div>
      </div>
    )
  })
}

// 保存新的文章
function savePost(cnt){
  let postContent = {
    cnt: cnt.content
  }
  if (cnt.id) {
    postContent.id = cnt.id
  }
  ajax.post('/blog/save', postContent)
  .then((data)=>{
    if (data && data.error) {
      msgtips.warning(data.message)
    } else {
      msgtips.success('保存成功')
      // window.location.href="/blog/add"
    }
  })
}
