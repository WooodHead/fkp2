import Pages from 'libs/pages'
import Input from 'component/modules/form/inputs'

function start(name, dom, utile){
  let router = utile.router
  , libs = utile.libs
  , inject = libs.inject()
  inject.css('/css/m/announce.css')  //注入样式


  function formStructor(){
    const fi = Input([
      'FKP2 单页DEMO',
      { input: <input type='text' id='intent' placehold="这里的数据会传给下一页" value='' /> },
      { input: <input type='button' id='test' value='你妹' /> }
    ])
    fi.rendered = function(){
      $('#test').click( e => {
        if (fi.form.intent) { router('second', {first: fi.form.intent}) }
        else { libs.msgtips('请填写数据', 'alert') }
      })
    }
    return fi
  }


  class Announce extends React.Component {
    render(){
      return (
        <div className='announce'>
          {(this.props.childs) ? this.props.childs : []}
        </div>
      )}
  }

  // 通过utile传递给其他 SPA的页面
  utile.plugins('Announce', Announce)
  utile.plugins('Input', Input)

  return Pages.new({
    trigger:function(){
      this.main()
    },
    main: function(){
      libs.changeTitle('新增地址');    //更改当前页面标题
      this.render( <Announce childs={ formStructor().render() }/>, dom )
      // $(dom).html('你好，这里是SPA示例')  // jq示例
    }
  })
}

module.exports = start;
