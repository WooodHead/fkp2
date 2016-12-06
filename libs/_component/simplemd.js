var block = {
  heading: /^ *(#{1,6}) *([^\n]+?) *#*$/,
  lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  text: /^[^\n]+/
};

function align(src){
  var cap
  if (cap = /^-+:([\w\W]+?)$/.exec(src)) {
    src = ['class="alignRigth"', cap[1]];
  } else if (cap = /^:-+:([\w\W]+?)$/.exec(src)) {
    src = ['class="alignCenter"', cap[1]];
  } else if (cap = /^:-+([\w\W]+?)$/.exec(src)) {
    src = ['class="alignLeft"', cap[1]];
  } else {
    src = ['', src];
  }
  return src
}

function simplemd(raw){
  raw = raw
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n')
    .replace(/^ +$/gm, '')

  var cap
    , out=''
    , tokens=[]

  while (raw) {
    // heading
    if (cap = block.heading.exec(raw)) {
      raw = raw.substring(cap[0].length);
      var [_align, src] = align(cap[2])
      out += '<h'
        + cap[1].length
        + _align + '>'
        + src
        + '</h'
        + cap[1].length
        + '>\n';
      continue;
    }

    // text
    if (cap = block.text.exec(raw)) {
      // Top-level should never reach here.
      raw = raw.substring(cap[0].length);
      var [_align, src] = align(cap[0])
      if (_align) {
        out += '<p '+_align+'>' + src + '</p>'
      } else {
        out += cap[0]
      }
      continue;
    }

    if (raw) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out
}

module.exports = simplemd
