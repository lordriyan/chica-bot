const axios = require('axios')

module.exports = function(log, args){
    return new Promise((resolve, reject) => {
        (async () => {
            if (args.length > 0) {
                var key = args.join(" ")
                axios.get(`https://api-frontend.kemdikbud.go.id/hit_mhs/${key}`)
                    .then(function (response) {
                        // handle success
                        var data = response.data.mahasiswa[0].text.replace(/ +(?= )/g,'')
                        if (data.startsWith("Cari kata kunci")) {
                            // No Bp not found
                            resolve([
                                {
                                    type: 'chat',
                                    message: `😕 Mahasiswa ${key} tidak ditemukan!`
                                }
                            ])
                        } else {
                            // No Bp found
                            data = data.split(",")
                            resolve([
                                {
                                    type: 'chat',
                                    message: data.join("\n")
                                }
                            ])
                        }
                        console.log();
                    })
                    .catch(function (error) {
                        // handle error
                        resolve([
                            {
                                type: 'chat',
                                message: `😕 Ada kesalahan saat mencari data!`
                            }
                        ])
                    })
                    .then(function () {
                        resolve([])
                    });
            } else {
                resolve([
                    {
                        type: 'chat',
                        message: `Sertakan nama atau no bp nya juga!
Contoh: - !cek-mhs 18192039193321
        - !cek-mhs Chiyo Masamune`
                    }
                ])
            }
        })()
    })
}