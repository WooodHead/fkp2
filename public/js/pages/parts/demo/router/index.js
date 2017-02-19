import {inject} from 'libs'
import {grids} from 'component'
import {router} from 'component/client'
import itemHlc from 'component/mixins/itemhlc'

import page1 from './common/page1'
import page2 from './common/page2'
import page3 from './common/page3'

if ($('#test-router').length) {
  const rter = router({
    container: 'test-router',
    mulitple: false,
    select: 1,
    data: [
      {title: '我是xxx', content: page1, path: 'page1'},
      {title: '我是yyy', content: page2, path: 'page2'},
      {title: '我是zzz', content: page3, path: 'page3'}
    ]
  })

  rter.render()
}
