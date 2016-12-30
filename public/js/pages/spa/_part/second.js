import Pages from 'libs/pages'

function start(name, dom, utile){
  let router = utile.router
  let libs = utile.libs

  function myRender(intent){
    let _childs = utile.Input([
      '第一页数据：' + (intent && intent.first||''),
      { input: [
        <input type='button' id='back' value='返回' />,
        <input type='button' id='prev' value='下一页' />
      ]}
    ],
    ()=>{
      $('#back').click(()=>{
        router.goback()
      })
      $('#prev').click(()=>{
        router('three', {second: '我来自第二页'})
      })
    })
    return <utile.Announce childs={_childs.render()} />
  }

  return Pages.new({
    trigger:function(ctx, intent){
      this.intent = intent || this.intent
      let _childs = myRender(intent)
      this.main(_childs)
    },
    main: function(childs){
      libs.changeTitle('第二页');    //更改当前页面标题
      this.render( childs, dom )
    }
  })
}

module.exports = start;
