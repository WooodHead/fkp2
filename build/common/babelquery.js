/**
 * [babelrcObject babel webpack 的配置]
 * @type {Object}
 */
var babelrcObject = {
    "presets": ["react", "es2015", "stage-0"],

    "plugins": [
        "transform-runtime",
        "add-module-exports",
        "transform-decorators-legacy",
        "transform-react-display-name",
        "typecheck"
    ],

    // "cacheDirectory": true,

    "env": {
        "development": {
            "plugins": [
                "react-hot-loader/babel",   //for 3
            ]
        },
        "dev": {
            "plugins": [
                "react-hot-loader/babel", //for 3
                "typecheck", ["react-transform", {
                    "transforms": [{
                        "transform": "react-transform-catch-errors",
                        "imports": ["react", "redbox-react"]
                    }]
                }]
            ]
        }
    }
}
var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};
// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
    combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);
var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, { plugins: combinedPlugins });
    delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
// var reactTransform = null;
// for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
//     var plugin = babelLoaderQuery.plugins[i];
//     if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
//         reactTransform = plugin;
//     }
// }
// if (!reactTransform) {
//     reactTransform = ['react-transform', { transforms: [] }];
//     babelLoaderQuery.plugins.push(reactTransform);
// }
// if (!reactTransform[1] || !reactTransform[1].transforms) {
//     reactTransform[1] = Object.assign({}, reactTransform[1], { transforms: [] });
// }
//
// // make sure react-transform-hmr is enabled
// reactTransform[1].transforms.push({
//   transform: 'react-transform-hmr',
//   imports: ['react'],
//   locals: ['module']
// })

// for development
module.exports = function(env){
  if (env=='pro') {
    delete babelrcObject.env
    return babelrcObject
  }
  return babelLoaderQuery
}
