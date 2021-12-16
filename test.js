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
    let s = ''

    let promise = new PromiseForTest((resolve, reject) => {
        resolve('test')
    })

    promise.then((value) => {
        log('<test2>', value)
        s = value

        let m = `except: 'test', output: <${s}>`
        ensure(s === 'test', m, 'test2: 测试resolve同步执行')
    }, () => {})
}

const test3 = function() {
    let s = ''

    let promise = new PromiseForTest((resolve, reject) => {
        this.setTimeout(() => {
            resolve('test')
        })
    })

    promise.then((value) => {
        s = value
        let m = `except: 'test', output: <${s}>`
        ensure(s === 'test', m, 'test3: 测试resolve异步执行')
    }, () => {})
}

const test4 = function() {
    let p = new PromiseForTest((resolve, reject) => {
        log('init4')
        resolve('a')
    })

    log('test4')

    p.then((v) => {
        log('promise4', v)
    })

    log('end4')
}

const test = function() {
    // test0()
    // test1()
    // test2()
    // test3()
    // test4()

    log(PromiseForTest.constructor)
}

test()
