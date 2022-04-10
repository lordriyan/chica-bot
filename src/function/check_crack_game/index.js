const axios = require('axios');
const argv = require('minimist-string');

// const translate = require('@vitalets/google-translate-api')
// const langcode = require('./lang-code.json')

module.exports = function(args){
    return new Promise((resolve, reject) => {
        (async () => {
            args = argv(args)
            
            var game_name = args.n
            if (game_name) {
                var url = 'https://steamcrackedgames.com/search/?q='+game_name;
            } else {
                
            }

            // if (langcode[args.d.toLowerCase()]) {
            //     translate(args.t, {to: langcode[args.d]}).then(res => {
            //         var pronon = (res.pronunciation) ? res.pronunciation : ""
            //         resolve([
            //             {
            //                 type: 'chat',
            //                 message: `${res.text}\n${pronon}`
            //             }
            //         ])
            //     }).catch(err => {
            //         console.error(err);
            //     });
            // } else {
            //     resolve([
            //         {
            //             type: 'chat',
            //             message: `Bahasa tujuan tidak dikenali!`
            //         }
            //     ])
            // }

        })()
    })
}