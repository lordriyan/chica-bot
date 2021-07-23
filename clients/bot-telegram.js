// Ref: https://github.com/telegraf/telegraf

const c             = require('chalk')    					// https://github.com/chalk/chalk
const { Telegraf }  = require('telegraf')
const fs            = require('fs');
const Arisu         = require('../arisuai')

function init(config, db_config) {

    var telegraf = new Telegraf(config.token)
        telegraf.start((ctx) => ctx.reply('Hello!'))
        // telegraf.help((ctx) => ctx.reply('Send me a sticker'))

        telegraf.on('text', (ctx) => {
            if (ctx.from.is_bot) return; // Ignore chat from another bot
            if (ctx.message.text == "!qr-wa") {
                try {
                    ctx.replyWithPhoto({ source: fs.readFileSync('qr_code.png') });
                    return;
                } catch (error) {
                    return;
                }
            }
            group_info = {
                id: null,
                member_list_id: []
            }
            if (ctx.chat.type === 'group'){
                group_info.id = ctx.chat.id
                process.send({ log: c`Incoming in-group message from {yellow ${ctx.from.id}}` });
            } else {
                process.send({ log: c`Incoming direct message from {yellow ${ctx.from.id}}` });
            }
            
            message_arr = []
            message_arr.push({
                type: 'text',
                value: ctx.message.text
            })
            arisu = new Arisu(db_config)
            arisu.talk({
                userid: ctx.from.id,
                group: group_info,
                platfrom: 'bot-telegram',
                message: message_arr
            }, function (feedback) { 
                ctx.reply(feedback)
            });

        })
        telegraf.launch()
    
    process.send({ log: "Running.." });
    
}

process.on('message', (msg) => {
    if (msg.config && msg.db_config) {
        init(msg.config, msg.db_config)
    }
});