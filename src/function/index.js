const fs = require('fs')

module.exports = {
    f: function(cmd){
        // Check if function is up, fix, or crash
        let metainfo = JSON.parse(fs.readFileSync(`${__dirname}/${cmd}/metainfo.json`))

        if (metainfo.status == "up") {
            let modul = require(__dirname+'/'+cmd+'/index.js')
            delete require.cache[__dirname+'\\'+cmd+'\\index.js'];
            delete require.cache[__dirname+'/'+cmd+'/index.js'];
            return modul;
        } else if (metainfo.status == "fix") {
            return function () {
                return [
                    {
                        type: 'chat',
                        message: `⚠️ Maaf, fitur ini masih dalam perbaikan!`
                    }
                ]
            }
        } else {
            return function () {
                return [
                    {
                        type: 'chat',
                        message: `⛔ Oopss! Fitur ini sedang ada kesalahan, pihak pengembang telah diinformasikan!`
                    }
                ]
            }
        }
    }
}
