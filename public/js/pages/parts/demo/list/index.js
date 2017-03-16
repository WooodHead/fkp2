import {inject} from 'libs'
import {list, item} from 'component'
import news from './_common/news'
import card from './_common/card'
import effctimg from './_common/effct-img'

inject()
.css(`
  .mb{
    margin-bottom: 20px
  }
`)
const Merge = (
  <div>
    <div className="mb">{news}</div>
    <div className="mb">{card}</div>
    <div className="mb">{effctimg}</div>
  </div>
)

if(document.getElementById('list')){
  React.render(Merge, document.getElementById('list'))
}
