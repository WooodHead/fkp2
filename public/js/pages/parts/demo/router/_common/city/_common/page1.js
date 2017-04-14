import { inject } from 'libs'
import { htabs as Tabs,list } from 'component/client'
import tree from 'component/util/tree'

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
  {title: 'G', url:'javascript:;', idf: 'G'},
]
const regiontree = tree(region1)
const regiondlist = list({data: regiontree})

const region2 = [
  {title: 'H', url:'javascript:;', idf: 'H'},
  {title: 'J', url:'javascript:;', idf: 'J'},
  {title: 'K', url:'javascript:;', idf: 'K'},
  {title: 'L', url:'javascript:;', idf: 'L'},
  {title: 'M', url:'javascript:;', idf: 'M'},
  {title: 'N', url:'javascript:;', idf: 'N'},
  {title: 'O', url:'javascript:;', idf: 'O'},
  {title: 'P', url:'javascript:;', idf: 'P'},
  {title: 'Q', url:'javascript:;', idf: 'Q'},
]
const regiontree2 = tree(region2)
const regiondlist2 = list({data: regiontree2})

const region3 = [
  {title: 'R', url:'javascript:;', idf: 'R'},
  {title: 'S', url:'javascript:;', idf: 'S'},
  {title: 'T', url:'javascript:;', idf: 'T'},
  {title: 'W', url:'javascript:;', idf: 'W'},
  {title: 'X', url:'javascript:;', idf: 'X'},
]
const regiontree3 = tree(region3)
const regiondlist3 = list({data: regiontree3})

const region4 = [
  {title: 'Y', url:'javascript:;', idf: 'Y'},
  {title: 'Z', url:'javascript:;', idf: 'Z'},
]
const regiontree4 = tree(region4)
const regiondlist4 = list({data: regiontree4})

const result = [
  {title: 'ABCDEFGH', url:'javascript:;', idf: 'ah',content: regiondlist},
  {title: 'JKLMNOPQ', url:'javascript:;', idf: 'jq',content: regiondlist2},
  {title: 'RSTWX', url:'javascript:;', idf: 'rx',content: regiondlist3},
  {title: 'YZ', url:'javascript:;', idf: 'yz',content: regiondlist4},
]
const city = Tabs({
  data: result,
  theme: 'tabs/city',
  tabClass: 'city-list',
  itemMethod: function(dom, index){
    $(dom).click((e)=>{
      e.stopPropagation()
      this.select(index)
    })
  }
})

export default city.render()
