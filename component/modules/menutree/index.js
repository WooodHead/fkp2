var MenuTree = require('./_menutree/index');

function menuTree(data, opts ){}
menuTree.pure = function(props){
  let Component =  MenuTree()
  return <Component {...props} />
};

module.exports = menuTree
