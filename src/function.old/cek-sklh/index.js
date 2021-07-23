const axios = require('axios')

module.exports = function(log, args){
    return new Promise((resolve, reject) => {
        (async () => {
            if (args.length > 0) {
                var key = args.join(" ")
                axios.get(`https://api-sekolah-indonesia.herokuapp.com/sekolah/s?sekolah=${key}`)
                    .then(function (response) {
                        // handle success
                        var data = response.data
                        if (data.status != "success") {
                            // Not found
                            resolve([
                                {
                                    type: 'chat',
                                    message: `😕 Sekolah ${key} tidak ditemukan!`
                                }
                            ])
                        } else {
                            // Found
                            data = data.dataSekolah[0]
                            var alamat = `${data.alamat_jalan} ${data.kecamatan} ${data.kabupaten_kota} ${data.propinsi}`

                            resolve([
                                {
                                    type: 'chat',
                                    message: `🏫 *Data Sekolah Ditemukan!*
*Nama Sekolah:* _${data.sekolah}_
*NPSN:* _${data.npsn}_
*Alamat:* _${data.alamat_jalan}_
*Kecamatan:* _${data.kecamatan}_
*Kabupaten/Kota:* _${data.kabupaten_kota}_
*Provinsi:* _${data.propinsi}_`
                                },
                                {
                                    type: 'map',
                                    latitude: data.lintang,
                                    longitude: data.bujur,
                                    marker_title: alamat
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
                        message: `Sertakan nama sekolah nya juga!
Contoh: - !cek-sklh smk n 2 padang`
                    }
                ])
            }
        })()
    })
}