import {list, item} from 'component'

const _result = {
  img: 'http://pic.c-ctrip.com/hotelinternational121211/inn/pic/pic_rec02.jpg',
  body:[
    {
      title: '京都',
      url: 'javascript:;',
      k: '清水寺前小径斜',
    }
  ],
  dot: '200家住宿'
}
//

const structure = item({
  data: _result
})

const EffctImg = (
  <div className="effctimg-item">{structure}</div>
)

export default EffctImg
