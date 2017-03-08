import { list, tabs } from 'component'
import {filtrate} from 'component/modules/filtrate'

// const tempData = [ '站1', '站2', '站3', '站4', '站5', '站6' ]
//
// const line1 = list({
//   data: tempData
// })
//
// const line2 = list({
//   data: tempData
// })
//
// const line3 = list({
//   data: tempData
// })
//
// const line4 = list({
//   data: tempData
// })
//
// const line5 = list({
//   data: tempData
// })
//
// // 地铁线路结构
// const subwaysData = [
//   // 三级
//   {title: '一号线', content: line1.render(), idf: 'line1'},  // level 3
//   {title: '二号线', content: line2.render(), idf: 'line2'},  // level 3
//   {title: '三号线', content: line3.render(), idf: 'line3'},  // level 3
//   {title: '四号线', content: line4.render(), idf: 'line4'},  // level 3
//   {title: '五号线', content: line5.render(), idf: 'line5'}  // level 3
// ]
//
// const metroList = tabs({
//   data: subwaysData
// })
// metro end


const treeData = [
  {title: '位置', content: '', idf: 'position'},
  {title: '不限', content: '', parent: 'position'},
  {title: '商业区', content: '', parent: 'position', idf: 'bzone'},   // level 2 idf
  {title: '行政区/下辖市县', content: '', parent: 'position', idf: 'district'},   // level 2 idf
  {title: '机场/车站', content: '', parent: 'position', idf: 'station'},   // level 2 idf
  {title: '地铁线', content: '', parent: 'position', idf: 'metro'},   // level 2 idf
  {title: '景点', content: '', parent: 'position', idf: 'field'},   // level 2 idf
  {title: '大学', content: '', parent: 'position', idf: 'university'},   // level 2 idf
  {title: '医院', content: '', parent: 'position', idf: 'hospital'},   // level 2 idf
  {title: '游乐园', content: '', parent: 'position', idf: 'fairground'},   // level 2 idf

  {title: '价格', content: '', idf: 'price'},
  {title: '不限', content: '', parent: 'price'},
  {title: '50-99元', content: '', parent: 'price'},
  {title: '100-149元', content: '', parent: 'price'},
  {title: '150-199元', content: '', parent: 'price'},
  {title: '200-299元', content: '', parent: 'price'},
  {title: '300-49元', content: '', parent: 'price'},
  {title: '500上', content: '', parent: 'price'},

  {title: '星级', content: '', idf: 'star'},
  {title: '不限', content: '', parent: 'star'},
  {title: '经济/客栈', content: '', parent: 'star'},
  {title: '三星/舒适', content: '', parent: 'star'},
  {title: '四星/高档', content: '', parent: 'star'},
  {title: '五星/豪华', content: '', parent: 'star'},

  {title: '品牌', content: '', idf: 'brand'},
  {title: '不限', content: '', parent: 'brand'},
  {title: '如家', content: '', parent: 'brand'},
  {title: '景江之星', content: '', parent: 'brand'},
  {title: '华住', content: '', parent: 'brand'},
  {title: '速8', content: '', parent: 'brand'},
  {title: '格林豪泰', content: '', parent: 'brand'},
  {title: '维也纳', content: '', parent: 'brand'},
  {title: '布丁', content: '', parent: 'brand'},
  {title: '7天', content: '', parent: 'brand'},


  {title: '特色', content: '', idf: 'feature'},
  {title: '不限', content: '', parent: 'feature'},
  {title: '别墅轰趴', content: '', parent: 'feature'},
  {title: '情侣酒店', content: '', parent: 'feature'},
  {title: '今日可预约', content: '', parent: 'feature'},

  // 三级
  {title: '浦东机场', content: '', parent: 'bzone'},
  {title: '虹口区', content: '', parent: 'district'},
  {title: '上海浦东国际机场', content: '', parent: 'station'},
  {title: 'metroList.render()', content: '', parent: 'metro'},  // level 3
  {title: '外滩', content: '', parent: 'field'},
  {title: '上海海洋大学', content: '', parent: 'university'},
  {title: '瑞金医院', content: '', parent: 'hospital'},
  {title: '世纪公园', content: '', parent: 'fairground'}
]


const filtR = filtrate({
  data: treeData,
  itemMethod: function(dom, index){
    $(dom).click((e)=>{
      e.stopPropagation()
      this.select(index)
    })
  }
})
filtR.render('id-filtrate')
