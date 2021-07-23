const { fork } = require('child_process');
const c = require('chalk'); // https://github.com/chalk/chalk
const fs = require('fs');

console.clear();
console.log(c`\n{bold.rgb(153,90,233) \n	               ..|'''.| '||       ||                       ..|'''.|                         \n	             .|'     '   || ..   ...    ....   ....      .|'     '    ...   ... ..    ....  \n	             ||          ||' ||   ||  .|   '' '' .||     ||         .|  '|.  ||' '' .|...|| \n	             '|.      .  ||  ||   ||  ||      .|' ||     '|.      . ||   ||  ||     ||      \n	              ''|....'  .||. ||. .||.  '|...' '|..'|'     ''|....'   '|..|' .||.     '|...'}\n\n                         {rgb(100,100,100)  Riyan Saputra (LordRiyan) }                         {bgRgb(153,90,233).black  2020 © Aorex Lab }\n\n`);
plog(`Initializing..`, 'info', 'system');

// Listing client by read all folder inside client directory
	fs.readdirSync('./src/client/').forEach(file => {		
		var metainfo = JSON.parse(fs.readFileSync(`./src/client/${file}/metainfo.json`)); // Read the metainfo.json

		if (!(file.indexOf('.') !== -1)) { // Just read folder
			if (metainfo.isEnabled) {
				plog(c`{cyan ${metainfo.name}} {green enabled}, preparing..`, 'info', 'client');

				var forked = fork(`./src/client/${file}/index.js`); // Create fork for client file
					forked.send({metainfo}); // Send metainfo to start the client

					// Listining for client message
						forked.on('message', (e) => {
							if (e.log) {
								plog(c`{cyan ${metainfo.name}} ${e.log.message}`, e.log.type, 'client');
							}
						})

			} else {
				plog(c`{cyan ${metainfo.name}} {red disabled}, skiping..`, 'warn', 'client');
			}
		}

	});

/**
 * Custom styled console log
 * @param {String} message The message body
 * @param {String} type The type of log
 * @param {String} modul The modul name
 */
function plog (message, type = "info", modul = "") {
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
	console.log(c`${log_type} {gray ${modul.toUpperCase()}} ${message}`);
}