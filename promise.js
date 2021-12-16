const { log, isFunction } = require('./utils')

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
                callback(param)
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
        if (isFunction(onFulfilled)) {
            this.callbacksAfterFulfilled.push(onFulfilled)
        }

        if (isFunction(onRejected)) {
            this.callbacksAfterRejected.push(onRejected)
        }

        let p = new PromiseForTest(() => {})
        return p
    }
}

module.exports = PromiseForTest
