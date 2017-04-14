import {inject} from 'libs'
import {wrapItem, grids, list, input as Input, htabs as Tabs} from 'component/client'
import tree from 'component/util/tree'


function index(router){
  const regionhot = [
    {title: '热门', url:'javascript:;', idf: 'hot', itemClass: 'city-hot-title'},
    {title: '北京', url:'javascript:;', parent: 'hot'},
    {title: '亳州', url:'javascript:;', parent: 'hot'},
    {title: '宝鸡', url:'javascript:;', parent: 'hot'},
    {title: '本溪', url:'javascript:;', parent: 'hot'},
    {title: '包头', url:'javascript:;', parent: 'hot'},
    {title: '蚌埠', url:'javascript:;', parent: 'hot'},
    {title: '保定', url:'javascript:;', parent: 'hot'},
    {title: '北海', url:'javascript:;', parent: 'hot'},
    {title: '滨州', url:'javascript:;', parent: 'hot'},
  ]
  const regiontreehot = tree(regionhot)
  const regiondlisthot = list({data: regiontreehot})
  const region1 = [
    {title: 'A', url:'javascript:;', idf: 'A'},
    {title: '安庆', url:'javascript:;', parent: 'A'},
    {title: '鞍山', url:'javascript:;', parent: 'A'},
    {title: '安阳', url:'javascript:;', parent: 'A'},
    {title: 'B', url:'javascript:;', idf: 'B'},
    {title: '北京', url:'javascript:;', parent: 'B'},
    {title: '亳州', url:'javascript:;', parent: 'B'},
    {title: '宝鸡', url:'javascript:;', parent: 'B'},
    {title: '本溪', url:'javascript:;', parent: 'B'},
    {title: '包头', url:'javascript:;', parent: 'B'},
    {title: '蚌埠', url:'javascript:;', parent: 'B'},
    {title: '保定', url:'javascript:;', parent: 'B'},
    {title: '北海', url:'javascript:;', parent: 'B'},
    {title: '滨州', url:'javascript:;', parent: 'B'},
    {title: 'C', url:'javascript:;', idf: 'C'},
    {title: '北京', url:'javascript:;', parent: 'C'},
    {title: '亳州', url:'javascript:;', parent: 'C'},
    {title: '宝鸡', url:'javascript:;', parent: 'C'},
    {title: '本溪', url:'javascript:;', parent: 'C'},
    {title: '包头', url:'javascript:;', parent: 'C'},
    {title: '蚌埠', url:'javascript:;', parent: 'C'},
    {title: '保定', url:'javascript:;', parent: 'C'},
    {title: '北海', url:'javascript:;', parent: 'C'},
    {title: '滨州', url:'javascript:;', parent: 'C'},
    {title: 'D', url:'javascript:;', idf: 'D'},
    {title: 'E', url:'javascript:;', idf: 'E'},
    {title: 'F', url:'javascript:;', idf: 'F'},
  ]
  const regiontree = tree(region1)
  const regiondlist = list({data: regiontree})
  const region2 = [
    {title: 'G', url:'javascript:;', idf: 'G'},
    {title: 'H', url:'javascript:;', idf: 'H'},
    {title: 'J', url:'javascript:;', idf: 'J'},
  ]
  const regiontree2 = tree(region2)
  const regiondlist2 = list({data: regiontree2})
  const region3 = [
    {title: 'K', url:'javascript:;', idf: 'K'},
    {title: 'L', url:'javascript:;', idf: 'L'},
    {title: 'M', url:'javascript:;', idf: 'M'},
    {title: 'N', url:'javascript:;', idf: 'N'},
  ]
  const regiontree3 = tree(region3)
  const regiondlist3 = list({data: regiontree3})
  const region4 = [
    {title: 'O', url:'javascript:;', idf: 'O'},
    {title: 'P', url:'javascript:;', idf: 'P'},
    {title: 'Q', url:'javascript:;', idf: 'Q'},
    {title: 'R', url:'javascript:;', idf: 'R'},
    {title: 'S', url:'javascript:;', idf: 'S'},
    {title: 'T', url:'javascript:;', idf: 'T'},
    {title: 'W', url:'javascript:;', idf: 'W'},
  ]
  const regiontree4 = tree(region4)
  const regiondlist4 = list({data: regiontree4})
  const region5 = [
    {title: 'X', url:'javascript:;', idf: 'X'},
    {title: 'Y', url:'javascript:;', idf: 'Y'},
    {title: 'Z', url:'javascript:;', idf: 'Z'},
  ]
  const regiontree5 = tree(region5)
  const regiondlist5 = list({data: regiontree5})

  const result = [
    {title: '热门', url:'javascript:;', idf: ' hot',content: regiondlisthot},
    {title: 'ABCDEF', url:'javascript:;', idf: 'ah',content: regiondlist},
    {title: 'GHJ', url:'javascript:;', idf: 'jq',content: regiondlist2},
    {title: 'KLMN', url:'javascript:;', idf: 'rx',content: regiondlist3},
    {title: 'OPQRSTW', url:'javascript:;', idf: 'yz',content: regiondlist4},
    {title: 'XYZ', url:'javascript:;', idf: 'yz',content: regiondlist5},
  ]
  const city = Tabs({
    data: result,
    theme: 'tabs/citybox',
    tabClass: 'city-box',
    itemMethod: function(dom, index){
      $(dom).click((e)=>{
        e.stopPropagation()
        this.select(index)
      })
    }
  })
  const Citybox = wrapItem(
    <div className='citybigbox'>
      <div className='citybigbox-head'>
        <p>支持中文/拼音/简拼输入</p>
        <i className='cloneicon'></i>
      </div>
      {city.render()}
    </div>
    ,function(dom){
      $(dom).find('.cloneicon').click(()=>{
        $(dom).parents('.fkp-desc').css({'display':'none'})
      })
    }
  )

  const configForm = [
    {title: '出发城市:',
      input:{
        id: 'ckcity',
        type: 'text',
        placehold: '中文/拼音',
        desc: <Citybox/>,
        itemMethod: function(dom){
          console.log('=====');
        }
      },
      union: {
        id: 'ckcity',
        cb: function(dom){
          console.log('00000');
        }
      }
    }
  ]

  const checkboxcity = Input({data: configForm,theme: 'form/jx',listClass:'control-city'})

  checkboxcity.rendered = function(){
    $('#ckcity').focus(()=>{
      $('.fkp-desc').css({'display':'block'})
    })
  }
  // const CheckboxcityDom = (
  //   <div>{checkboxcity.render()}</div>
  // )
  return checkboxcity.render()
}

export default function(router){
  return {
    main: function(data){
      return index(router)
    },

    enter: function(data){
      return this.main(data)
    },

    leave: function(){
    },

    loaded: function(dom){

    }
  }
}
