const c = require('chalk')
const { Telegraf } = require('telegraf')
const fs = require('fs')

function init(metainfo) {
    
    var telegraf = new Telegraf(metainfo.config.token)
        telegraf.start((ctx) => ctx.reply('Hello!'))
        // telegraf.help((ctx) => ctx.reply('Send me a sticker'))

        telegraf.on('text', (ctx) => {
            if (ctx.from.is_bot) return; // Ignore chat from another bot
            

            if (ctx.chat.type === 'group'){
                plog(c`Incoming in-group message from {yellow ${ctx.from.id}}`)
            } else {
                plog(c`Incoming direct message from {yellow ${ctx.from.id}}`)
            }

            if (ctx.message.text == "!qr-wa") {
                try {
                    ctx.replyWithPhoto({ source: fs.readFileSync('./temp/qr_code.png') });
                    plog(`Sending QR Code to telegram`)
                    return;
                } catch (error) {
                    plog(`${error}`, 'error')
                    return;
                }
            }

        })
        telegraf.launch()

    plog(c`{green running..}`)
}

process.on('message', (e) => {
    if (e.metainfo) {
        init(e.metainfo)
    } else {
        
        
    }
});

function plog(message, type = 'info') {
    process.send({ log: { message, type }});
}