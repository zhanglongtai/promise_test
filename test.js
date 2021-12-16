const { log } = require('./utils')
const PromiseForTest = require('./promise')

const ensure = function(condition, message, title = '') {
    if (!condition) {
        log(`>>> ${title}测试失败:`, message)
    } else {
        log(`<<< ${title}测试成功`)
    }
}

const test0 = function() {
    let p = new Promise((resolve, reject) => {
        log('init')
        resolve('a')
    })

    log('test0', p.state)

    p.then((v) => {
        log('promise then', v)
    })

    log('end')
}

const test1 = function() {
    let s = ''

    let promise = new PromiseForTest(() => {
        s = 'test'
    })

    let m = `except: 'test', output: <${s}>`
    ensure(s === 'test', m, 'test1: 测试Promise立即执行')
}

const test2 = function() {
    let promise = new PromiseForTest((resolve, reject) => {
        resolve('test')
    })

    promise.then((value) => {
        let m = `except: 'test', output: <${value}>`
        ensure(value === 'test', m, 'test2: 测试resolve同步执行')
    }, () => {})
}

const test3 = function() {
    let promise = new PromiseForTest((resolve, reject) => {
        this.setTimeout(() => {
            resolve('test')
        })
    })

    promise.then((value) => {
        let m = `except: 'test', output: <${value}>`
        ensure(value === 'test', m, 'test3: 测试resolve异步执行')
    }, () => {})
}

const test4 = function() {
    let promise = new PromiseForTest((resolve, reject) => {
        this.setTimeout(() => {
            resolve('test1')
            resolve('test2')
        })
    })

    promise.then((value) => {
        let m = `except: 'test1', output: <${value}>`
        ensure(value === 'test1', m, 'test4: 测试then的onFulfilled回调只触发一次')
    }, () => {})
}

const test5 = function() {
    let promise = new PromiseForTest((resolve, reject) => {
        reject('test')
    })

    promise.then((value) => {

    }, (reason) => {
        let m = `except: 'test', output: <${reason}>`
        ensure(reason === 'test', m, 'test5: 测试reject同步执行')
    })
}

const test6 = function() {
    let promise = new PromiseForTest((resolve, reject) => {
        this.setTimeout(() => {
            reject('test')
        })
    })

    promise.then((value) => {

    }, (reason) => {
        let m = `except: 'test', output: <${reason}>`
        ensure(reason === 'test', m, 'test6: 测试reject异步执行')
    })
}

const test7 = function() {
    let promise = new PromiseForTest((resolve, reject) => {
        this.setTimeout(() => {
            reject('test1')
            reject('test2')
        })
    })

    promise.then((value) => {

    }, (reason) => {
        let m = `except: 'test1', output: <${reason}>`
        ensure(reason === 'test1', m, 'test7: 测试then的onRejected回调只触发一次')
    })
}

const test8 = function() {
    let p1 = new PromiseForTest((resolve, reject) => {
        this.setTimeout(() => {
            resolve('test1')
        })
    })

    let p2 = p1.then((value) => {
        return 'test2'
    }, (reason) => {})

    p2.then((value) => {
        let m = `except: 'test2', output: <${value}>`
        ensure(value === 'test2', m, 'test8: 测试then返回的链式调用')
    }, (reason) => {})
}

const test = function() {
    // test0()
    // test1()
    test2()
    test3()
    test4()
    test5()
    test6()
    test7()

    // log(PromiseForTest.constructor)
}

test()
