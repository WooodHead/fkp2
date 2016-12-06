import {inject, msgtips, poper, insertCaret, validator} from 'libs'
import Input from 'component/modules/form/inputs'
import ajax from 'ajax'
import injectStatic from './_common/injectStatic'

injectStatic(initEpicEditor)
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
    editor.importFile('_tmp',options.content)
  }

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

  let Validator = validator()
  function chkUsername(value, block, errmsg){
    return value && value.length && block.username.test(value)
  }
  function formAction(form){
    $('#username').blur(function(){
      let stat = Validator(this.value, 'username', chkUsername)()
      if (!stat) form.warning('username')
      else {
        form.warning('username','no')
      }
    })
    $('#password').blur(function(){
      let stat = Validator(this.value, 'password')()
      if (!stat) form.warning('password')
      else {
        form.warning('password','no')
      }
    })
    $('#login').click(()=>{
      let values = form.values()
      let chk = Validator
          (values.username, 'username', chkUsername)
          (values.password, 'password')
          ((query, errs)=>{
            if (errs.length) {
              errs.map((item)=>{
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

  var formStructor = Input([
    ':---请登录后使用',
    { input: <input type='text' id='username' placehold="username/email" value='' />, title: '用户名：' },
    { input: <input type='password' id='password' value='' />, title: "密码：" },
    { input: <input type='button' id='login' value='登录' />, title: ' ' }
  ], formAction)

  $(utilbar).find('.md-save')
  .off('click')
  .click(()=>{
    let cnt = JSON.parse(editor.exportFile(null, 'json'))
    ajax.post('/blog/save', {cnt: cnt.content})
    .then((data)=>{
      if (data.error=='10005') {
        poper.modal.p30(
          <div style={{textAlign: 'left'}}>
            <div>{formStructor.render()}</div>
            <div>
              <p>第三方登录</p>
              <ul className="logo">
                <li>
                  <a className='github' href='/github/sign'></a>
                </li>
              </ul>
            </div>
          </div>
        )
      } else {
        if (data && data.error) {
          msgtips.warning(data.message)
        } else {
          window.location.href="/blog"
        }
      }
    })
  })
}
