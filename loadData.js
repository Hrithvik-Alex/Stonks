const storage = require('electron-json-storage');

const defaultDataPath = storage.getDefaultDataPath()

// storage.set('assets', {items: ['AAPL', 'MSFT']}, (error) => {
//     if(error) throw error;
// })

// storage.remove('big money tings', (error) => {
//     if(error) throw error;
// })

storage.get('assets', (err,data) => {
    if(err) throw err;
    data["items"].forEach(equity => {
        console.log(equity);
    });
})

console.log(defaultDataPath)
