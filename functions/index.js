const fs = require('fs');

module.exports = {
    f: function(cmd, isOwner){
        // Check if function is up, fix, or crash
        let metainfo = JSON.parse(fs.readFileSync(`${__dirname}/${cmd}/metainfo.json`))

        if (metainfo.status == "up" || isOwner) {
            let modul = require(__dirname+'/'+cmd+'/index.js')
            delete require.cache[__dirname+'\\'+cmd+'\\index.js'];
            delete require.cache[__dirname+'/'+cmd+'/index.js'];
            return modul;
        } else if (metainfo.status == "fix") {
            return function () {
                return [
                    {
                        type: 'chat',
                        message: `⚠️ Perintah '${cmd}' masih dalam perbaikan!`
                    }
                ]
            }
        } else {
            return function () {
                return [
                    {
                        type: 'chat',
                        message: `⛔ Perintah '${cmd}' ada kerusakan internal!`
                    }
                ]
            }
        }
    },
    list: function(){
        // Get list function by folder
        var data = [
            {
                syntax: "help",
                desc: "Menu bantuan",
                status: "up"
            }
        ]
        fs.readdirSync('./functions/').forEach(file => {
            if (!(file.indexOf('.') !== -1)) {

                let metainfo = JSON.parse(fs.readFileSync(`./functions/${file}/metainfo.json`))

                data.push({
                    syntax: file,
                    desc: metainfo.desc,
                    status: metainfo.status      // up, crash, fix
                })
            }
        });

        return data
    },
    setStatus: function(cmd, status){
        // Set command status
        let metainfo = JSON.parse(fs.readFileSync(`./functions/${cmd}/metainfo.json`))

        if (metainfo.status == status) {
            // No change
            return false
        } else {
            // Change
            metainfo.status = status
            fs.writeFileSync(`./functions/${cmd}/metainfo.json`, JSON.stringify(metainfo));
            return true
        }
          
    }
}
