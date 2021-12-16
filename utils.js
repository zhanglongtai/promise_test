// const PromiseForTest = require('./promise')


const log = console.log.bind(console)

const isFunction = function(variable) {
    let is = typeof variable === 'function'
    return is
}

// const isPromise = function(variable) {
//     let is = variable instanceof PromiseForTest
//     return is
// }

module.exports = {
    log,
    isFunction,
    // isPromise,
}
