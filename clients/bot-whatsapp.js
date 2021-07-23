const c = require('chalk')    					// https://github.com/chalk/chalk
const wa = require('@open-wa/wa-automate');     // https://docs.openwa.dev/
const fs = require('fs');
const func = require('../functions')
const Arisu = require('../arisuai')

const bot = {
    number_phone: "6283178488062",
    name: "Chica",
    pref_cmd: "!",
    owner: "6282382961935",
    tester: [
        "6283861620642", // Ibnu Sabil
        "6281365116090", // Sauqi M. Rohit
        "6282384153762", // Iqbal Dwiansyah
    ],
    maintenance: false
}

// console.log = function () { } // Disable junk logs

function init(config, db_config) {
    
    wa.create({
        qrTimeout: 0,
        authTimeout: 0,
        chromiumArgs: ['--no-sandbox'],
        headless: true  // Set false to open browser
    }).then(client => start(client));
    
    function start(client) {

        client.onMessage(async message => {

            var isTalkToMe  = (message.mentionedJidList.includes(bot.number_phone+"@c.us") || !message.isGroupMsg)
            var isOwner     = (message.sender.id == bot.owner+"@c.us")
            var isTester    = (bot.tester.includes(message.sender.id.split("@")[0]))

            if (!bot.maintenance || isOwner || isTester) {
                
                
                if (isTalkToMe) { // Message is for bot
                    var chat = ""
                    var media = ""

                    if (message.type == 'chat') {
                        chat = message.body

                    } else if (message.type == 'image') {
                        chat = (typeof message.caption == "undefined") ? "" : message.caption
                        media = message.body
                    } else if (message.type == 'sticker'){

                    }

                    // Prosess the message

                        // Remove bot mention from chat
                            chat = chat.replace("@"+bot.number_phone, '').trim()
                            
                        // Check if message is a command
                            if (chat.startsWith(bot.pref_cmd)) { // Message is a command
                                var args = chat.substring(bot.pref_cmd.length).trim().split(" ") // Remove the bot prefix
                                var cmd = args[0] // Command
                                    args.shift() // Command arguments

                                if (cmd != "" && cmd != 'help') { // Command provided
                                    try {
                                        const responses = await func.f(cmd, isOwner)(log, args)
                                        if (responses.length > 0) await client.simulateTyping(message.from, true)
                                        responses.forEach(async e => {
                                            // e.type => image, chat, sticker, file, etc
                                            if (e.type == "chat") {
                                                await client.reply(message.from, e.message, message.id)
                                            }
                                            if (e.type == "map") {
                                                await client.sendLocation(message.from, e.latitude, e.longitude, e.marker_title)
                                            }
                                        });
                                        if (responses.length > 0) await client.simulateTyping(message.from, false)
                                    } catch (error) {
                                        console.log(error);
                                        if (fs.existsSync(`./functions/${cmd}`)) {
                                            if (func.setStatus(cmd, 'crash')){
                                                await client.sendText(bot.owner+'@c.us', `⚠️ *Crash Reporter* ⚠️

Pengirim\t: ${message.sender.verifiedName} (${message.sender.formattedName})
Jenis\t: ${message.type}
Grup\t: ${(message.isGroupMsg) ? '✅' : '❎'}

${error}
Sepertinya ada masalah pada perintah berikut:`);
                                                await client.forwardMessages(bot.owner+'@c.us' , message.id, true)
                                            }
                                            
                                            await client.reply(message.from, `Sepertinya ada masalah pada perintah '${bot.pref_cmd+cmd}'`, message.id)
                                        } else {
                                            await client.reply(message.from, `The following command '${bot.pref_cmd+cmd}' is not found!`, message.id)
                                        }
                                        

                                    }
                                } else { // No command provided
                                    var func_list = func.list()
                                    var string = ``
                                    func_list.forEach(e => {
                                        string += `   ${(e.status == "up") ? "🟢" : ((e.status == "fix") ? "🟡" : "🔴" )} *${bot.pref_cmd}${e.syntax}* - _${e.desc}_\n`
                                    });
                                    string += `\n*Keterangan:*\n   🟢 = Work\n   🟡 = Fixing\n   🔴 = Crash`
                                    await client.reply(message.from, `📜 *Daftar perintah:*\n${string}`, message.id)
                                }

                                
                            } else { // Message is not a command
                                
                                // arisu = new Arisu(db_config)
                                // await arisu.talk({
                                //     userid: message.from,
                                //     group: group_info,
                                //     platfrom: 'bot-whatsapp',
                                //     message: message_arr
                                // }, async function (feedback) {
                                //     await client.sendText(message.from, JSON.stringify(feedback));
                                // });

                            }

                }
                
                process.send({ log: c`{yellow Incoming message}
                                     Type            : ${message.type}
                                     Sender          : ${message.sender.verifiedName} (${message.sender.formattedName})
                                     InGroup         : ${message.isGroupMsg}
                                     Need Responses  : {${(isTalkToMe) ? 'green' : 'red'} ${isTalkToMe}}
                ` });

            } else if (isTalkToMe) {
                await client.reply(message.from, "Maaf, aku sekarang ini lagi dalam masa pengembangan! Silahkan ulang beberapa saat lagi! 😅", message.id)
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
        fs.writeFileSync('qr_code.png', imageBuffer);

    });
    
    process.send({ log: "Running.." });

}

function log(message) {
    process.send({ log: message });
}

process.on('message', (msg) => {
    if (msg.config && msg.db_config) {
        init(msg.config, msg.db_config)
    }
});