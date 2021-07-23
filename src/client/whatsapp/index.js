const c = require('chalk')
const wa = require('@open-wa/wa-automate'); // https://docs.openwa.dev/
const fs = require('fs')
const Chica = require('../../model')

const owner = "6282382961935"
const number_phone = "6283178488062"

function init(metainfo) {
    wa.create(metainfo.config).then(client => start(client));
    function start(client) {
        client.onMessage(async message => {
            
            var isTalkToClient = (message.mentionedJidList.includes(number_phone+"@c.us") || !message.isGroupMsg)
            var isOwner = (message.sender.id == owner+"@c.us")
            
            if (isTalkToClient) {

                if (message.type == 'chat') {
                    var chat = message.body
                    const responses = await Chica.talk({
                        message: chat
                    })
                    if (responses.length > 0) await client.simulateTyping(message.from, true)

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
                    if (responses.length > 0) await client.simulateTyping(message.from, false)
                }

            }

        });

        client.onStateChanged(state => {
            console.log('statechanged', state)
            if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
            if (state === 'UNPAIRED') {
                process.send({ log: c`{red Logged out!}` });
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