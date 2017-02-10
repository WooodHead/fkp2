import mdeditor from './_common/mdeditor'
import {DocmentView} from 'libs'

if (document.getElementById('epiceditor'))  {
  const docView = DocmentView()
  let editDom = document.getElementById('epiceditor')
  editDom.style.height = (docView.height-20) + 'px'
  mdeditor()
}
