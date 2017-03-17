import {inject} from 'libs'
import {grids, router, wrapItem} from 'component/client'

import page1 from './_common/page1'
import page2 from './_common/page2'
import page3 from './_common/page3'
const  Page4 = wrapItem( <div>我才是最后一页</div>, function(dom){ $(dom).click(function(){alert(1)}) } )

inject().css(`
  html{
    height: 100%;
    width: 100%;
  }
  body{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #test-router{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .treeContainer{
    height: 100%;
    overflow: hidden;
  }
`)

const Test1 = wrapItem(
  <div>
    <span style={{display: 'inline-block', marginRight: '0.4em'}}>1234</span>
    <span id='gotest' style={{display: 'inline-block'}}>点我</span>
  </div>
  , function(dom){
    $('#gotest').click( function(e){
      e.stopPropagation()
      alert('123')
    })
  }
)
if ($('#test-router').length) {
  const rter = router({
    container: 'test-router',
    animate: 'fade',
    // mulitple: true,
    scrollMenu: true,
    select: 1,
    data: [
      {title: '我是xxx', content: page1, path: 'page1'},
      {title: '我是yyy', content: page2, path: 'page2'},
      {title: '我是zzz', content: page3, path: 'page3'},
      {title: '我是aaa', content: <Page4 />, path: 'page4'},

      {title: <Test1 />, content: 'xxx', path: 'a/b'},
      {title: '我是aaa', content: 'xxx', path: 'a/1'},
      {title: '我是aaa', content: 'xxx', path: 'a/2'},
      {title: '我是aaa', content: 'xxx', path: 'a/3'},
      {title: '我是aaa', content: 'xxx', path: 'a/4'},
      {title: '我是aaa', content: 'xxx', path: 'a/5'},
      {title: '我是aaa', content: 'xxx', path: 'a/6'},
      {title: '我是aaa', content: 'xxx', path: 'a/7'},
      {title: '我是aaa', content: 'xxx', path: 'a/8'},
      {title: '我是aaa', content: 'xxx', path: 'a/9'},

      {title: '我是bbb', content: 'xxx', path: 'b/1'},
      {title: '我是bbb', content: 'xxx', path: 'b/2'},
      {title: '我是bbb', content: 'xxx', path: 'b/3'},
      {title: '我是bbb', content: 'xxx', path: 'b/4'},
      {title: '我是bbb', content: 'xxx', path: 'b/5'},
      {title: '我是bbb', content: 'xxx', path: 'b/6'},
      {title: '我是bbb', content: 'xxx', path: 'b/7'},
      {title: '我是bbb', content: 'xxx', path: 'b/8'},
      {title: '我是bbb', content: 'xxx', path: 'b/9'},

      {title: '我是ccc', content: 'xxx', path: 'c/1'},
      {title: '我是ccc', content: 'xxx', path: 'c/2'},
      {title: '我是ccc', content: 'xxx', path: 'c/3'},
      {title: '我是ccc', content: 'xxx', path: 'c/4'},
      {title: '我是ccc', content: 'xxx', path: 'c/5'},
      {title: '我是ccc', content: 'xxx', path: 'c/6'},
      {title: '我是ccc', content: 'xxx', path: 'c/7'},
      {title: '我是ccc', content: 'xxx', path: 'c/8'},
      {title: '我是ccc', content: 'xxx', path: 'c/9'}

    ]
  })
  rter.render()
}
