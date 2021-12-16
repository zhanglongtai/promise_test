const { log } = require('./utils')

class Enum {
    constructor(enumName, enumMap) {
        this.name = enumName
        let keys = Object.keys(enumMap)
        for (let key of keys) {
            this[key] = {
                name: key,
                value: enumMap[key],
            }
            Object.defineProperty(this, key, {
                get: function() {
                    return `<${this.name}.${key}: ${enumMap[key]}>`
                },
            });
        }
        log('run', enumMap)
    }

    static new(...args) {
        log(args)
        let o = new this.prototype.constructor(...args)
        return o
    }
}

let a = Enum.new('Test', {
    Key1: 1,
    Key2: 2,
})
log(a instanceof Enum, a.Key1, a.Key1.enumValue)