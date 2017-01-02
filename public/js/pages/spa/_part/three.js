import Pages from 'libs/pages'

function start(name, dom, utile){
  let router = utile.router
  let libs = utile.libs

  function myRender(intent){
    const formAsset = [
      '第二页数据：' + (intent.second||''),
      { input: [
        <input type='button' id='back2' value='返回' />,
        <input type='button' id='gofirst' value='第一页' />
      ]}
    ]
    let _childs = utile.Input({data: formAsset})
    _childs.rendered = ()=>{
      $('#back2').click(()=>{
        router.goback()
      })
      $('#gofirst').click(()=>{
        router('first')
      })
    }
    return <utile.Announce childs={_childs.render()} />
  }

  return Pages.new({
    trigger:function(ctx, intent){
      this.intent = intent
      let _childs = myRender(intent)
      this.main(_childs)
    },
    main: function(childs){
      libs.changeTitle('第三页');    //更改当前页面标题
      this.render( childs, dom )
    }
  })
}

module.exports = start;
