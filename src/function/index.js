const fs = require('fs')
const c = require('chalk')

module.exports = {
    f: function(cmd, isOwner){
        // Check if function is up, fix, or crash
        let metainfo = JSON.parse(fs.readFileSync(`${__dirname}/${cmd}/metainfo.json`))
        plog(c`Execute function {cyan ${cmd}}..`)

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

/**
 * Custom styled console log
 * @param {String} message The message body
 * @param {String} type The type of log
 * @param {String} modul The modul name
 */
function plog (message, type = "info") {
	var log_type = "";
	switch (type) {
		case 'danger':
		case 'error':
		case 'alert':
			log_type = c`{red [!]}`;
			break;
		case 'warning':
		case 'warn':
			log_type = c`{yellow [!]}`;
			break;
		case 'success':
		case 'ok':
			log_type = c`{green [!]}`;
			break;
		default:
			log_type = c`{cyan [!]}`;
			break;
	}
	process.stdout.write(c`${log_type} {gray FUNCTION} ${message}\n`);
}
