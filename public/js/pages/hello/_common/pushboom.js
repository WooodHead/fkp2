import {baselist} from 'component'
import {tips as msgtips} from 'component/client'
import itemHlc from 'component/mixins/itemhlc'
import Wsocket from 'libs/wsocket'

const inputxxx = $('#agzgzNav').find('input')
function appendBox(target){
  const value = inputxxx[0].value
  if (value && value.charAt(0)=='@') {
    Wsocket.emit('pushboom', value)
    target.value = ''
  }
}

const pushBoomHistoryData = [
  {"title":"文档","url":"http://www.agzgz.com/docs"},
  {"title":"博客","url":"http://www.agzgz.com/blog"},
]

let pushboom, PushBoom
let pushboomHis, PushBoomHis
const wsOnConfig = {
  'pushboom:data': function(treeVal){
    pushboom = baselist({ data: treeVal })
    pushboomHis = baselist({ data: pushBoomHistoryData, listClass: 'history' })
    PushBoom = (
      <div className="pushboomContainer">
        {pushboom.render()}
        {pushboomHis.render()}
      </div>
    )
    renderBoom(PushBoom)
  },

  'pushboom': function(val){
    if (val.title) {
      const {title, url} = val
      pushboom.prepend([{title: title, url: url}])
    }
    if (val.error) {
      msgtips.toast(val.error)
      pushboom.clear()
    }
  }
}

Object.keys(wsOnConfig).map( item=>{
  Wsocket.on(item, wsOnConfig[item])
})

function keydown(e) {
  var e = e||event;
  var currKey = e.keyCode||e.which||e.charCode;
  if (currKey) {
     switch (currKey) {
       case 13:
       appendBox(e.target)
       break;
     }
  }
}
document.onkeydown = keydown;
Wsocket.emit('pushboom:data')

function renderBoom(boom){
  React.render(boom, document.getElementById('pushboom'))
}
export default function(){}
