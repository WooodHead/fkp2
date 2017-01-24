import itemHlc from 'component/mixins/itemhlc'
import {sticky} from 'component/client'
import { inject } from 'libs'
// import { grids as Grids } from 'component'

const BLOG = SAX('Blog')
const Config = BLOG.get()
const grids = Config.grids

inject().css('/css/m/sticky/blog')
const stickyInner = {
  top: () => {
    const Bar = itemHlc( <div className="sticky-blog toplock">aaa</div> )
    return <Bar />
  },
  bot: ()=>{
    const Bar = itemHlc(
      <div className="sticky-blog bottomlock">
        <div className="b-left" id="b-left">
          {grids.start.render()}
        </div>
        <div className="b-right" id="b-right">
          {grids.docker.render()}
        </div>
      </div> )
    return <Bar />
  },
  scrolltop: () => {
    const Bar = itemHlc( <div className="sticky-blog" style={{marginTop: '30px'}}>bbb</div> )
    return <Bar />
  },
}

let stickys = {
  top: sticky(stickyInner.top()),
  bot: sticky.bottom(stickyInner.bot(), {delay: 1000}),
  _scrolltop: undefined,
  dytop: behav => {
    if (behav == 'show') {
      if (stickys._scrolltop) {
        stickys._scrolltop.show()
      } else {
        stickys._scrolltop = sticky(stickyInner.scrolltop())
        stickys._scrolltop.container.style.zIndex = '9990'
      }
    }
    else {
      stickys._scrolltop ? stickys._scrolltop.hide() : ''
    }
  }
}

export default stickys
