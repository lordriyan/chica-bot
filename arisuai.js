var mysql = require('mysql');					// https://remotemysql.com
const {Wit} = require('node-wit');				// https://github.com/wit-ai/node-wit
// var session = require('./session.json');

const wit = new Wit({accessToken: 'UB6XZV6EPQINPCAEKRJWJHUJXA34QAHV'});

class Arisu {
	
	db_config;
	
	constructor(db_config){
		this.db_config = db_config
	}

	talk(input, feedback){
		var db = mysql.createConnection(this.db_config);
			db.connect(function(err) {
				// Any arisu algorithm here
					/**
					 * input
					 * 	{
					 * 		"userid":923996662,
					 * 		"group":{
					 * 			"id":null,
					 * 			"member_list_id":[]
					 * 		},
					 * 		"platfrom":"telegram",
					 * 		"message":[
					 * 			{"type":"text","value":"o"}
					 * 		]
					 * 	}
					 * 
					 * output
					 * 	{
					 * 		"userid": 923996662,
					 * 		"groupid": null,
					 * 		"responses": [
					 * 			{
					 * 				type: "text/card/images/audio/document/etc",
					 * 				value: "Hi!"
					 * 			}
					 * 		]
					 * 	
					 * 	}
					 */
									
				// Output format
					var output = {
						userid: input.userid,
						groupid: input.group.id,
						responses: []
					}

				// Check each input message by type
					for (let i = 0; i < input.message.length; i++) {
						const msg = input.message[i];
						if (msg.type == "text") {
							// User input is a text
								// Get user intent
								wit.message(msg.value, {}).then((data) => {
									
										// console.log(session);



										output.responses.push({
											type: "text",
											value: data
										})
										feedback(output)
									})
							

						} else {
							// User input is not a text, check the type automaticaly


							
						}
					}

				db.end(); // End mysql connection
			});
	}

	action(input, feedback){
		
	}
	
	
}

module.exports = Arisu