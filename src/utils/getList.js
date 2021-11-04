const path = require('path');
const p = require('./readfile');
let data = path.join(__dirname, '../config/whitelist.json');
let file = p.get(data);

exports.getWebsites = function makeWebsiteList() {
    var WebsiteList = [];
    for(i in file['Websites'])
    {
        WebsiteList[i]= file['Websites'][i];
    }
    return WebsiteList;
}