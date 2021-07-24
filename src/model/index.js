const {Wit} = require('node-wit'); // https://github.com/wit-ai/node-wit
const fs = require('fs');
require('dotenv').config()
const wit = new Wit({accessToken: process.env.wit_accessToken});
const func = require('../function')
const c = require('chalk')

const ownerAccountId = [
	"6282382961935@c.us" // WhatsApp Id
]

module.exports = {
	talk: function(input){
		return new Promise((resolve, reject) => {
			(async () => {
				var isOwner = ownerAccountId.includes(input.user_id)

				wit.message(input.message, {}).then(async (result) => {
					var intent_wit = false;
					if (result.intents.length) {
						intent_wit = result.intents[0].name
					}
					
					if (intent_wit) { // Chica can respon the input
						let response = JSON.parse(fs.readFileSync(`./src/model/responses.json`))
						
						var intent = response[intent_wit] // Get the intent detail

						try {
							var message = intent.responses[Math.floor(Math.random() * intent.responses.length)]
						} catch (error) {
							plog(c`No responses provided for intent {red ${intent_wit}}!`, 'error')
						}

						if (message) {
							
							var cmd = intent.action;
	
							// Check every entity that needed
							intent.entity.forEach(e => {
								if (e.require_message) {
									if(!result.entities[`${e.name}:${e.roles}`]){
										resolve([
											{
												type: 'chat',
												message: e.require_message
											}
										])
									} else {
										message = message.replace(`{${e.name}:${e.roles}}`, result.entities[`${e.name}:${e.roles}`][0].value)
										if (cmd) cmd = cmd.replace(`{${e.name}:${e.roles}}`, result.entities[`${e.name}:${e.roles}`][0].value)
									}
								} else {
									if (result.entities[`${e.name}:${e.roles}`]) { // Value provided
										message = message.replace(`{${e.name}:${e.roles}}`, result.entities[`${e.name}:${e.roles}`][0].value)
										if (cmd) cmd = cmd.replace(`{${e.name}:${e.roles}}`, result.entities[`${e.name}:${e.roles}`][0].value)
									} else {
										message = message.replace(`{${e.name}:${e.roles}}`, e.default_value)
										if (cmd) cmd = cmd.replace(`{${e.name}:${e.roles}}`, e.default_value)
									}
								}
							});
							
							var returned = [
								{
									type: 'chat',
									message: message
								}
							]
	
							// Run action if provided
							if (cmd) {
								var file = cmd.split(" ")[0]
								var action = [
									{
										type: 'chat',
										message: `⛔ Oopss! Sepertinya ada masalah! Tapi tenang, pihak pengembang telah diinformasikan!`
									}
								]
								try {
									action = await func.f(file, isOwner)(cmd)
								} catch (error) {
									plog(c`{syan ${file}} {red ${error}}!`, 'error', 'function')
									// Change function metainfo.json
									let metainfo = JSON.parse(fs.readFileSync(`./src/function/${file}/metainfo.json`))
										metainfo.status = "crash"
									fs.writeFileSync(`./src/function/${file}/metainfo.json`, JSON.stringify(metainfo, null, 2));
										
								}

								returned = [
									...returned,
									...action
								]
							}
	
							resolve(returned)

						} else {
							intent = response['fallback']
							var message = intent.responses[Math.floor(Math.random() * intent.responses.length)]

							resolve([
								{
									type: 'chat',
									message: message
								}
							])
						}

					} else {
						let response = JSON.parse(fs.readFileSync(`./src/model/responses.json`))
							intent = response['fallback']
						var message = intent.responses[Math.floor(Math.random() * intent.responses.length)]

						resolve([
							{
								type: 'chat',
								message: message
							}
						])
					}
				})
			})()
		})
	},
	action: function(log, args){
		return new Promise((resolve, reject) => {
			(async () => {

			})()
		})
	}	
}
/**
 * Custom styled console log
 * @param {String} message The message body
 * @param {String} type The type of log
 * @param {String} modul The modul name
 */
 function plog (message, type = "info", modul = 'MODEL') {
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
	process.stdout.write(c`${log_type} {gray ${modul.toUpperCase()}} ${message}\n`);
}
