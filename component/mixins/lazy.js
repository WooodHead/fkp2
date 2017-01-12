import {addEvent, rmvEvent, getOffset, DocmentView, scrollView} from 'libs'

function update(elements, settings) {
  let counter = 0;
  elements.map( (element, i) => {

    // 可见区域内
    if (inviewport(element, settings)){
      if(element.getAttribute('data-src')){  // block
        const state = element.getAttribute('state')
        const _src = element.getAttribute('data-src')
        if (!state) {
          element.setAttribute('state', 'done')
          ajax.get(_src, function(data){
            element.innerHTML(data)
          })
        }
      }

      if (element.getAttribute('data-imgsrc')) {
        const state = element.getAttribute('state')
        if (!state) {
          const _src = element.getAttribute('data-imgsrc')
          if (element.nodeName == 'IMG') {
            element.src = _src
          } else if (!element.children.length) {
            $(element).append('<img src="'+_src+'" />')
            element.removeAttribute('data-imgsrc')
          }
          element.setAttribute('state', 'done')
        }
        else if (state == 'ready') {
          const _src = element.getAttribute('data-imgsrc')
          if (element.nodeName == 'IMG') {
            element.src = _src
          }
          // else {
          //   $(element).find('img').attr('src', _src)
          // }
          element.setAttribute('state', 'done')
        }
      }
    }

    // 不可见区域
    else {
      if (element.getAttribute('data-imgsrc')) {
        const state = element.getAttribute('state')
        if (state && state == 'done') {
          const _src = element.getAttribute('data-imgsrc')
          if (element.nodeName == 'IMG') {
            element.src = settings.placeholder
          } else {
            $(element).find('img').attr('src', settings.placeholder)
          }
          element.setAttribute('state', 'ready')
        }
      } else {
        if (element.nodeName == 'IMG') {
          const _src = element.getAttribute('src')
          element.setAttribute('data-imgsrc', _src)
        }
      }
      // element.removeAttribute('state')
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
