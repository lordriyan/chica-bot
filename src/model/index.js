const {Wit} = require('node-wit'); // https://github.com/wit-ai/node-wit
const fs = require('fs');
const wit = new Wit({accessToken: 'UB6XZV6EPQINPCAEKRJWJHUJXA34QAHV'});
const func = require('../function')

module.exports = {
	talk: function(input){
		return new Promise((resolve, reject) => {
			(async () => {
				wit.message(input.message, {}).then(async (result) => {
					var intent = false;
					if (result.intents.length) {
						intent = result.intents[0].name
					}
					
					if (intent) { // Chica can respon the input
						let response = JSON.parse(fs.readFileSync(`./src/model/responses.json`))

						intent = response[intent] // Get the intent detail
						var message = intent.responses[Math.floor(Math.random() * intent.responses.length)]

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
							var args = cmd.split(" ")
								cmd = args[0] 
								args.shift()
							const action = await func.f(cmd)(args)
							console.log(action);
							
							returned = [
								...returned,
								...action
							]
						}

						resolve(returned)
					} else {
						resolve([
							{
								type: 'chat',
								message: `Maaf aku ga ngerti :(`
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