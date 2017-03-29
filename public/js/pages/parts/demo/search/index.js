import { search } from 'component/modules/search'

const props = {
  data: [
    {title: '111', api: 'http://www.163.com', relative: '6666'},
    {title: '222', api: 'http://www.173.com', relative: '7777'},
    {title: '333', api: 'http://www.183.com', relative: '8888'}
  ],
  searchMethod: function(dom){
    if (!dom.value) {
      return [
        {title: '你好啊', attr: {value: '111'}},
        {title: 'yyyy', attr: {value: '222'}},
        {title: 'zzzz', attr: {value: '333'}}
      ]
    } else {
      return [
        {title: '什么鬼', attr: {value: '111'}},
        {title: 'ttt', attr: {value: '222'}},
        {title: 'zzzz', attr: {value: '333'}}
      ]
    }
  },
  searchOptionMethod: function(dom){
    return true
  }
}
const Xxx = search({})
React.render(<Xxx.x {...props}/>, document.getElementById('test'))