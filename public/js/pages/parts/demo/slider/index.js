import { Slider } from 'component/modules/slider'

let Xslider = Slider({
  container: 'slider',
  data: [
    <div className="pure-g">
      <div className="pure-u-8-12">
        <img src="/images/banner/hello/banner-3.jpg" title="Funky roots" />
      </div>
      <div className="pure-u-4-12 descript">
        <h3>FKP2</h3>
        Full Stack Plus 2<br/> SAP/MPA最佳实践方式
      </div>
    </div>,

    <div className="pure-g">
      <div className="pure-u-8-12">
        <img src="/images/banner/hello/banner-2.jpg" title="The long and winding road" />
      </div>
      <div className="pure-u-4-12 descript">
        <h3>脚手架</h3>
        gulp+webpack组合，灵活、模块化的脚手架系统
      </div>
    </div>,

    <div className="pure-g">
      <div className="pure-u-8-12">
        <img src="/images/banner/hello/banner-7.jpg" title="Happy trees" />
      </div>
      <div className="pure-u-4-12 descript">
        <h3>前端</h3>
        Babel、JQ+React的混合流组件模式
      </div>
    </div>,

    <div className="pure-g">
      <div className="pure-u-8-12">
        <img src="/images/banner/hello/banner-4.jpg" title="Happy trees" />
      </div>
      <div className="pure-u-4-12 descript">
        <h3>node端</h3>
        灵活、低配置，无限层级RESTFUL路由
      </div>
    </div>
  ],
  // control: [
  //   <img src="/images/test/t_tree_root.jpg" title="Funky roots" />,
  //   <img src="/images/test/hill_fence.jpg" title="The long and winding road" />,
  //   <img src="/images/test/t_houses.jpg" title="Happy trees" />
  // ],
}).render()