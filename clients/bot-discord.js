// Ref: https://discordjs.guide/

const c         = require('chalk')
const Discord   = require('discord.js')
const client    = new Discord.Client()
const Arisu     = require('../arisuai')

function init(config, db_config) {

    client.on('ready', () => { // Bot is running
        client.on('message', message => {
            if (message.author.bot) return; // Ignore message from another bot
                    
            const embed_loading = new Discord.MessageEmbed()
                .setColor('#f0d511')
                .setAuthor('Loading..', 'https://www.asiamiles.com/content/dam/am-content/common/images/icons/loading.gif')
            message.reply(embed_loading).then(loading_message => {

                // Get user input
                    message_arr = [];
                    if (message.content.length > 0) {
                        message_arr.push({
                            type: "text",
                            value: message.content
                        })
                    }
                    if (message.attachments.size > 0) {
                        message.attachments.every(file => {
                            message_arr.push({
                                type: "attachments",
                                value: file.url
                            })
                        })
                    }
                    group_info = {
                        id: null,
                        member_list_id: []
                    }

                // Check if the message from group or direct message
                if (message.channel.type != "dm"){ 
                    process.send({ log: c`Incoming in-group message from {yellow ${message.author.id}}` });
                    message.guild.members.fetch().then(fetchedMembers => {
                        group_info.id = message.channel.id

                        fetchedMembers.forEach(element => {
                            group_info.member_list_id.push(element.id)
                        });

                        arisu = new Arisu(db_config)
                        arisu.talk({
                            userid: message.author.id,
                            group: group_info,
                            platfrom: 'bot-discord',
                            message: message_arr
                        }, function (feedback) {
                            loading_message.delete({ timeout: 0 }) // Remove loading message
                            message.reply(JSON.stringify(feedback))
                        });
                    })
                } else {
                    arisu = new Arisu(db_config)
                    arisu.talk({
                        userid: message.author.id,
                        group: group_info,
                        platfrom: 'bot-discord',
                        message: message_arr
                    }, function (feedback) {
                        loading_message.delete({ timeout: 0 }) // Remove loading message
                        message.reply(JSON.stringify(feedback))
                    });
                    process.send({ log: c`Incoming direct message from {yellow ${message.author.id}}` });
                }
            })
        });

        process.send({ log: "Running.." });
    });
    client.login(config.token);
}
process.on('message', (msg) => {
    if (msg.config && msg.db_config) {
        init(msg.config, msg.db_config)
    }
});