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
        this.fulfillmentValue = null
        this.rejectionReason = null
        this.onFulfilledFunctions = []
        this.onRejectedFunctions = []

        executor(this.runAfterResolve.bind(this), this.runAfterReject.bind(this))
    }

    runNextLoop(callback, value) {
        setTimeout(() => {
            callback(value)
        })
    }

    runAfterResolve(fulfillmentValue) {
        log('run')
        this.state = State.Fulfilled
        this.fulfillmentValue = fulfillmentValue

        for (let callback of this.onFulfilledFunctions) {
            this.runNextLoop(callback, fulfillmentValue)
        }
    }

    runAfterReject(rejectionReason) {
        this.state = State.Rejected
        this.rejectionReason = rejectionReason

        for (let callback of this.onFulfilledFunctions) {
            this.runNextLoop(callback, rejectionReason)
        }
    }

    then(onFulfilled, onRejected) {
        this.onFulfilledFunctions.push(onFulfilled)
        this.onRejectedFunctions.push(onRejected)
        // log('run then')
        // if (this.state === State.Fulfilled) {
        //     onFulfilled(this.fulfillmentValue)
        // } else if (this.state === State.Rejected) {
        //     onRejected(this.rejectionReason)
        // } else {
        //     this.onFulfilled = onFulfilled
        //     this.onRejected = onRejected
        // }
        // log('run then1', this.state)
    }
}

module.exports = PromiseForTest
