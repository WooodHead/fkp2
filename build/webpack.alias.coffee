path = require('path')

module.exports =
    root: path.resolve(path.join(__dirname, '../'))
    libs: path.resolve(path.join(__dirname, '../libs/libs_client'))
    ajax: path.resolve(path.join(__dirname, '../libs/ajax')),
    component: path.resolve(path.join(__dirname, '../component'))
