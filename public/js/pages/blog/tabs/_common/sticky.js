import itemHlc from 'component/mixins/itemhlc'
import {sticky} from 'component/client'
import { inject } from 'libs'
inject().css('/css/blog/sticky')

const RUNTIME = SAX('Runtime')
const BLOG = SAX('Blog')
const Config = BLOG.get()
const grids = Config.grids

BLOG.setActions({
  'TAGSLIST': function(data){
    const tagList = Config.createlist({data: data})
    grids.tags.replace(tagList)
  }
})

const stickyInner = {
  top: () => {
    const Bar = itemHlc(
      <div className="sticky-blog toplock">
        <span className='agzgz'>AGZGZ</span>
        <span className='descript'>关注JS全栈、同构React</span>
      </div> )
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
    Config.pullBlogTags()
    const Bar = itemHlc( <div className="sticky-blog top-tags" style={{marginTop: '40px'}}>{grids.tags.render()}</div> )
    return <Bar />
  },
  toolbar: () => {
    const Bar = itemHlc( <div className="sticky-blog" style={{marginBottom: '40px'}}>{grids.toolbar.render()}</div> )
    return <Bar />
  },
}

let stickys = {
  top: sticky(stickyInner.top()),
  bot: sticky.bottom(stickyInner.bot(), {delay: 1000}),
  _scrolltop: undefined,
  _toolbar: undefined,
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
  },
  toolbar: behav => {
    if (behav == 'show') {
      if (stickys._toolbar) {
        stickys._toolbar.show()
      } else {
        stickys._toolbar = sticky.bottom(stickyInner.toolbar())
        stickys._toolbar.container.style.zIndex = '9990'
      }
    }
    else {
      stickys._toolbar ? stickys._toolbar.hide() : ''
    }
  }
}

export default stickys
