const { fork }  = require('child_process')
const c 		= require('chalk')    					// https://github.com/chalk/chalk
var mysql 		= require('mysql')						// https://remotemysql.com

var lengthModule = 20
var db_config = {
	host: "remotemysql.com",
	port: "3306",
	database: "XMZ8IIxWWf",
	user: "XMZ8IIxWWf",
	password: "6ssHadTF7h"
}

console.clear()
console.log(c`

{bold.rgb(153,90,233)
                          |              ||                       ..|'''.|                         
                         |||    ... ..  ...   ....  ... ...     .|'     '    ...   ... ..    ....  
                        |  ||    ||' ''  ||  ||. '   ||  ||     ||         .|  '|.  ||' '' .|...|| 
                       .''''|.   ||      ||  . '|..  ||  ||     '|.      . ||   ||  ||     ||      
                      .|.  .||. .||.    .||. |'..|'  '|..'|.     ''|....'   '|..|' .||.     '|...' 
}
                         {rgb(100,100,100)  Riyan Saputra (LordRiyan) }                         {bgRgb(153,90,233).black  2020 © AsiradLab }

`)
console.log(c`{${gMN("SYSTEM")}} System initializing..`)
console.log(c`{${gMN("DATABASE")}} Check connection to database..`)

var con = mysql.createConnection(db_config)
	con.connect(function(err) {
		if (err) {
			console.log(c`{${gMN("DATABASE")}} {red ${err.sqlMessage}}`)
			console.log(c`{${gMN("DATABASE")}} Database check {red failed}`)
			process.exit()
		}
		console.log(c`{${gMN("DATABASE")}} Database check {green success}`)
        console.log(c`{${gMN("CLIENT")}} Client setting up.. `)
        con.query("SELECT * FROM setting_clients", function (err, result, fields) {
			if (err) {
				console.log(c`{${gMN("DATABASE")}} {red ${err}}`)
				process.exit()
			}
			for (let i = 0; i < result.length; i++) {
				const e = result[i]
				if (e.active == 1) {
					console.log(c`{${gMN("CLIENT")}} ${e.name} {green enable}, initializing..`)
					var file = e.name
						file = file.replace(/\s/g, '-')
						file = file.toLowerCase()
					
					e.config = JSON.parse(e.config)

					var forked = fork(`./clients/${file}.js`)
						forked.send({
							config: e.config,
							db_config: db_config
						})
						forked.on('message', (msg) => {
							if (msg.log) {
								console.log(c`{${gMN("CLIENT")}} {rgb(102, 153, 255) <${e.name}>} ${msg.log}`)
							}
						})

				} else {
					console.log(c`{${gMN("CLIENT")}} ${e.name} {yellow disable}, skiping..`)
				}
			}
        })
			
		con.end()

    })


/**
 * Function to print ajustable log
 * @param {String} name - This is modular name
 */
function gMN(name) {
	space = ""
	for (let i = lengthModule; i > name.length; i--) space += " "
	return "gray" + space + "[" + name + "]"
}