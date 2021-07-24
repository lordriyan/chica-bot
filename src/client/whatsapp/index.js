const c = require('chalk')
const wa = require('@open-wa/wa-automate'); // https://docs.openwa.dev/
const fs = require('fs')
const Chica = require('../../model')

const number_phone = "6283178488062"

console.log = function() {} // Disable console.log to avoid open-wa junk log

function init(metainfo) {
    wa.create(metainfo.config).then(client => start(client));
    function start(client) {
        client.onMessage(async message => {
            
            var isTalkToClient = (message.mentionedJidList.includes(number_phone+"@c.us") || !message.isGroupMsg)
            
            if (isTalkToClient) {

                if (message.type == 'chat') {
                    await client.simulateTyping(message.from, true)
                    
                    plog(c`Incoming message from {bgCyan.black  ${message.sender.id} }`, 'info')

                    var chat = message.body.replace('@'+number_phone, '')
                    const responses = await Chica.talk({
                        message: chat,
                        user_id: message.sender.id
                    })

                    responses.forEach(async (e, i) => {
                        // e.type => image, chat, sticker, file, document, etc
                        if (e.type == "chat") {
                            if (i > 0) await client.sendText(message.from, e.message)
                            else await client.reply(message.from, e.message, message.id)
                        }
                        if (e.type == "map") {
                            await client.sendLocation(message.from, e.latitude, e.longitude, e.marker_title)
                        }
                        
                    });

                    await client.simulateTyping(message.from, false)
                }

            }

        });

        client.onStateChanged(state => {
            plog(`State changed to ${state.toLowerCase()}`, 'warning')
            if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
            if (state === 'UNPAIRED') {
                plog(`State changed to unpaired`, 'error')
                client.kill();
                init(config, db_config);
            }
        });
    }

    wa.ev.on('qr.**', async qrcode => {
        //qrcode is base64 encoded qr code image
        //now you can do whatever you want with it
        const imageBuffer = Buffer.from(qrcode.replace('data:image/png;base64,', ''),'base64');
        fs.writeFileSync('./temp/qr_code.png', imageBuffer);
    });

    plog(c`{green running..}`)
}

process.on('message', (e) => {
    if (e.metainfo) {
        init(e.metainfo)
    }
});

function plog(message, type = 'info') {
    process.send({ log: { message, type }});
}