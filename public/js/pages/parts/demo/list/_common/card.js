import {list, item} from 'component'

const _result = {
  img: 'https://dimg08.c-ctrip.com/images/100v0d0000006ygi2D863_C_280_158.jpg',
  body:[
    {
      title: '长隆野生动物世界',
      url: 'javascript:;',
      k: <span className="color-0078e7 sketch">《奇妙的朋友》节目主要拍摄场地！</span>,
    }
  ],
  footer:<span><i className="color-0078e7">￥<strong>657</strong></i>起</span>,
  dot: <a herf="javascript:;" className="btn btn-primary">抢购</a>
}
//

const structure = item({
  data: _result
})

const Card = (
  <div className="card-item">{structure}</div>
)

export default Card
