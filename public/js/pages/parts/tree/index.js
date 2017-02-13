import {queryString} from 'libs'

let query = queryString()

const config = {
  fold: false
}
let items = []
$('.tree-menu-body').find('li').each(function(ii, dom){
  if ($(dom).hasClass('itemroot')) {
    if (config.fold) $(dom).find('.itemCategory ul').addClass('none')
  } else {
    items.push(dom)
    const treeId = $(dom).attr('data-treeid')
    let href = $(dom).find('a').attr('href')
    $(dom).find('a').attr('href', href+'?treeid='+treeId)

    if (query && query.treeid && treeId == query.treeid) {
      $(dom).addClass('selected')
    }
  }



  $(dom).click(function(e){
    e.stopPropagation()
    $(items).removeClass('selected')
    if ($(this).hasClass('itemroot')) {
      $(this).find('.caption:first').toggleClass('fold')
      $(this).find('ul:first').toggleClass('none')
    } else {
      $(this).addClass('selected')
    }
  })

})
