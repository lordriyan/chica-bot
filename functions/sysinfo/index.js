const c = require('chalk')
const process = require('process')
const osu = require("node-os-utils");

module.exports = function(log, args){
    return new Promise((resolve, reject) => {
        (async () => {
            let msg = `📊 *System Information*\n\n`
            
            if (args.includes('-help')) {
                msg += `Available arguments:
-help\tShow help menu
-os\t\tShow os name
-cpu\t\tShow CPU usage
-uptime\tShow bot uptime
-mem\tShow memory usage
-net\t\tShow network usage
`
                
            } else {
                const isAll = (args.length == 0)

                if (isAll || args.includes("-os")) {
                    var oos = await osu.os.oos()
                    if (oos != "not supported"){
                        msg += `  💿 Operating System\n\t${oos}\n`
                    }

                }
                if (isAll || args.includes("-cpu")) {
                    var cpu_threads = osu.cpu.count()
                    var cpu_usage = await osu.cpu.usage()

                    msg += `  ⏲️ CPU\n\tUsage\t: ${cpu_usage} %\n\tThreads\t: ${cpu_threads}\n`
                    
                }
                if (isAll || args.includes("-uptime")) {
                    msg += `  ⏱️ Uptime \n\t${Math.round(process.uptime())} s\n`
                    
                }
                if (isAll || args.includes("-ram")) {
                    // Get the number of total memory in Byte
                    const mem = await osu.mem.info()

                    // Print the result in MB
                    msg += `  📼 Memory \n\t${(mem.totalMemMb - mem.freeMemMb).toFixed(2)} MB / ${mem.totalMemMb.toFixed(2)} MB\n`
                    
                }
                if (isAll || args.includes("-net")) {
                    const net = await osu.netstat.inOut()
                    
                    if (net != "not supported"){
                        msg += `  📼 Network \n\tIn\t: ${net.total.inputMb.toFixed(2)} MB\n\tOut\t: ${net.total.outputMb.toFixed(2)} MB\n`
                    }

                }
            }
            
            resolve([
                {
                    type: 'chat',
                    message: msg
                }
            ])
        })()
    })
}
