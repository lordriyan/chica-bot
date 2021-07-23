module.exports = function(value){
    return new Promise((resolve, reject) => {
        (async () => {
            console.log(value);
            resolve([
                {
                    type: 'chat',
                    message: `Perintah dijalankan!`
                }
            ])
        })()
    })
}