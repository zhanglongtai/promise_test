const fs = require('fs')
const { spawnSync } = require('child_process')
const chokidar = require('chokidar')
const { log } = require('./utils')

class Throttle {
    constructor(callback) {
        this.timeoutId = null
        this.callback =callback
    }

    run() {
        clearTimeout(this.timeoutId)

        this.timeoutId = setTimeout(() => {
            this.callback()
        }, 1000)
    }
}

const executeTest = function(filePath) {
    log('\n\n\n\n\n========== test start ==========')
    let { stdout, stderr } = spawnSync('node', ['test.js'])
    log(stdout.toString(), stderr.toString())
    log('========== test end ==========\n\n\n\n\n')
}

const main = function() {
    let args = process.argv
    let targetFilePath = args[2]

    let throttle = new Throttle(executeTest)

    log(`start auto test - ${targetFilePath}\n`)
    // fs.watch(targetFilePath, {}, (eventType, filename) => {
    //     log('watch', eventType, filename)
    //     if (eventType === 'change') {
    //         throttle.run()
    //     }
    // })

    let watcher = chokidar.watch(targetFilePath)
    watcher.on('change', (path, stats) => {
        throttle.run()
    });
}

main()
