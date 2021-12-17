const {
    log,
    isFunction,
} = require('./utils')

const State = {
    Pending: 'Pending',
    Fulfilled: 'Fulfilled',
    Rejected: 'Rejected',
}

class PromiseForTest {
    constructor(executor) {
        this.state = State.Pending
        this.value = null
        this.reason = null
        this.callbacksAfterFulfilled = []
        this.callbacksAfterRejected = []

        executor(this.runAfterFulfilled.bind(this), this.runAfterRejected.bind(this))
    }

    static isPromise(variable) {
        let is = variable instanceof PromiseForTest
        return is
    }

    runNextLoop() {
        setTimeout(() => {
            let callbacks = []
            let param = null
            if (this.state === State.Fulfilled) {
                callbacks = this.callbacksAfterFulfilled
                param = this.value
            } else if (this.state === State.Rejected) {
                callbacks = this.callbacksAfterRejected
                param = this.reason
            }

            while (callbacks.length > 0) {
                let callback = callbacks.shift()
                let r = callback.handler(param)

                if (!PromiseForTest.isPromise(r)) {
                    callback.nextPromise.runAfterFulfilled(r)
                } else {
                    r.then((value) => {
                        callback.nextPromise.runAfterFulfilled(value)
                    }, () => {})
                }
            }
        })
    }

    runAfterFulfilled(fulfillmentValue) {
        if (this.state === State.Pending) {
            this.state = State.Fulfilled
            this.value = fulfillmentValue

            this.runNextLoop()
        }
    }

    runAfterRejected(rejectionReason) {
        if (this.state === State.Pending) {
            this.state = State.Rejected
            this.reason = rejectionReason

            this.runNextLoop()
        }
    }

    then(onFulfilled, onRejected) {
        let p = new PromiseForTest(() => {})

        if (isFunction(onFulfilled)) {
            let o = {
                handler: onFulfilled,
                nextPromise: p,
            }

            this.callbacksAfterFulfilled.push(o)
        }

        if (isFunction(onRejected)) {
            let o = {
                handler: onRejected,
                nextPromise: p,
            }
            this.callbacksAfterRejected.push(o)
        }

        return p
    }
}

module.exports = PromiseForTest
