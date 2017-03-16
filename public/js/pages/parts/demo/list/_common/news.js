import {list, item} from 'component'

const _result = {
  img: 'http://dimg10.c-ctrip.com/images/fd/hotel/g5/M07/A2/88/CggYsFbxDhSAJGTMAB6feQ8PEQc905_R_130_130.jpg',
  body:[
    {
      title: '桔子酒店.精选（上海外滩吴淞路店）',
      url: 'javascript:;',
      k: <a href="javascript:;" className='review'>4.7分| 来自2975人点评</a>,
      v: <span className="comment">“ 欧式建筑，环境优雅，房间干净 </span>,
    }
  ],
  dot: <span>￥<i className="color-108ee9"><strong>657</strong>起</i></span>
}


const structure = item({
  data: _result
})

const StructureBig = (
  <div className="item-news">{structure}</div>
)

export default StructureBig
