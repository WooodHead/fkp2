import {addEvent, rmvEvent, getOffset, DocmentView, scrollView} from 'libs'

function update(elements, settings) {
  let counter = 0;
  elements.map( (element, i) => {

    // 可见区域内
    if (inviewport(element, settings)){
      if(element.getAttribute('data-src')){
        let _src = element.getAttribute('data-src')
        if (element.nodeName === 'IMG'){
          element.src = _src;
        } else{
          ajax.get(_src, function(data){
            element.innerHTML(data)
          })
        }
      }
      if(element.getAttribute('data-imgsrc') && element.nodeName != 'IMG'){
        let _src = element.getAttribute('data-imgsrc')
        if (!element.children.length) {
          $(element).append('<img src="'+_src+'" />')
        } else {
          $(element).find('img').attr('src', _src)
        }
      }
    }

    // 不可见区域
    else {
      if (element.getAttribute('data-imgsrc') && element.nodeName != 'IMG' ){
        $(element).find('img').attr('src', settings.placeholder)   // $(element).find('img').remove()
      }
      if (element.nodeName==='IMG'){
        $(element).parent().attr('data-imgsrc', element.src)
        $(element).remove()
      }
    }
  })
}

function inviewport (element, settings) {
  return !rightoffold(element, settings) && !leftofbegin(element, settings) &&
    !belowthefold(element, settings) && !abovethetop(element, settings);
}

function belowthefold(element, settings) {
  var fold;
  if (!settings.container || settings.container == window) {
    fold = DocmentView().height + DocmentView().top;
  } else {
    fold = getOffset(settings.container).bottom;
  }
  return fold <= getOffset(element).top - settings.threshold;
};

function rightoffold (element, settings) {
  var fold
  if (!settings.container || settings.container == window) {
    fold = DocmentView().width + DocmentView().left;
  } else {
    fold = getOffset(settings.container).left + getOffset(settings.container).width;
  }
  return fold <= getOffset(element).left - settings.threshold;
};

function abovethetop (element, settings) {
  var fold;
  if (!settings.container || settings.container == window) {
    fold = DocmentView().top;
  } else {
    fold = getOffset(settings.container).top;
  }
  return fold >= getOffset(element).top + settings.threshold  + getOffset(element).height;
}

function leftofbegin(element, settings) {
  var fold;
  if (!settings.container || settings.container == window) {
    fold = DocmentView().left;
  } else {
    fold = getOffset(settings.container).left;
  }
  return fold >= getOffset(element).left + settings.threshold + getOffset(element).width;
}

export default function lazyLoad(elements, scrollContainer, datas){
  if (!elements)  return

  var settings = {
    threshold       : 2000,
    failure_limit   : 0,
    event           : "scroll",
    effect          : "show",
    container       : scrollContainer,
    data_attribute  : "original",
    skip_invisible  : true,
    appear          : null,
    load            : null,
    error           : null,
    complete        : null,
    placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
  }

  update(elements, settings)
}
