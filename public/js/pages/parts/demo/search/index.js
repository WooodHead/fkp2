import { search } from 'component/modules/search'

const props = {
  data: [
    {title: '111', api: 'http://www.163.com'},
    {title: '222', api: 'http://www.173.com'},
    {title: '333', api: 'http://www.183.com'}
  ]
}
const Xxx = search({})
React.render(<Xxx.x {...props}/>, document.getElementById('test'))