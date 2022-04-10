const axios = require('axios');
const argv = require('minimist-string');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const translate = require('@vitalets/google-translate-api')
var rates = {
    timestamp: 12983199237,
    value: 14254.3
}

module.exports = function(args){
    return new Promise((resolve, reject) => {
        (async () => {
            args = argv(args)
            
            var country = args.c

            // Get current currency rates
            // axios.get(`https://www.amdoren.com/api/currency.php?api_key=hSB7DzTgHMJj6jUaz2pFabamrc4gJW&from=USD&to=IDR`).then(function (response) {
            //     rates = response.data.amount

                // Translate nama negara ke bahasa ingriss
                translate(country, {to: "en"}).then(res => {
                    country = res.text.toLowerCase().split(" ").join("-")
                    
                    // Bikin request ke web https://www.ceicdata.com/
                    axios.get(`https://www.ceicdata.com/en/indicator/${country}/national-government-debt`).then(function (response) {
                        console.log(response.data);
    
                        const dom = new JSDOM(response.data);

                        if (dom.window.document.querySelectorAll('title')[0].textContent != "Indicators") {
                            
                            var data = {
                                last: {
                                    value: parse(dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td span')[0].textContent.trim()),
                                    date: dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td span')[2].textContent.trim()
                                },
                                previous: {
                                    value: parse(dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td span')[3].textContent.trim()),
                                    date: dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td span')[5].textContent.trim()
                                },
                                min: {
                                    value: parse(dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td')[2].textContent.trim().split("\n")[0]),
                                    date: dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td span')[6].textContent.trim()
                                },
                                max: {
                                    value: parse(dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td')[3].textContent.trim().split("\n")[0]),
                                    date: dom.window.document.querySelectorAll('.dp-table.dp-table-auto tbody tr td span')[7].textContent.trim()
                                },
                                
                            }

                            resolve([
                                {
                                    type: 'chat',
                                    message: `Terakhir _(${data.last.date})_
*${data.last.value}*

Sebelumnya _(${data.previous.date})_
*${data.previous.value}*

Minimal _(${data.min.date})_
*${data.min.value}*

Maximal _(${data.max.date})_
*${data.max.value}*

Sumber : _https://www.ceicdata.com/_`
                                }
                            ])

                        } else {
                            
                            resolve([
                                {
                                    type: 'chat',
                                    message: `Data tidak ditemukan!`
                                }
                            ])

                        }
                        
                    })
                        
                        
                }).catch(err => {
                    console.error(err);
                });

            // })
            

        })()
    })
}

function parse(duid) {
    duid = duid.trim()
    duid = duid.replace(/,/g,'')
    duid = parseFloat(duid)
    duid = duid * 1000000
    duid = duid * rates.value
    duid = duid / 1000000000000
    duid = duid.toFixed(2)
    return "Rp "+ duid.toString().replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " T"
}