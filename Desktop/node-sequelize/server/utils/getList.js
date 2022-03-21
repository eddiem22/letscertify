const path = require('path');
const p = require('./readfile');
let data = path.join(__dirname, '../config/whitelist.txt');
let file = p.get(data);

exports.modules = {
    makeHashList() {
    var HashList = [];
    for(i in file['Hashes'])
    {
        HashList[i]= file['Hashes'][i];
    }
    return HashList;
}, 




}