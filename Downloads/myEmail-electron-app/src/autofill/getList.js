const path = require('path');
fs = require('fs');
const p = require('./readfile');
let data = path.join(__dirname, 'autofill.json');
let file = p.get(data);

let getCreds = function() {
    var CredsList = [];
    CredsList.push(file.email)
    CredsList.push(file.password)
    CredsList.push(file.smtp)
    //console.log(CredsList)

    if(!CredsList)
    {return 'EMPTY'}
    else{return CredsList;}
}

const fillCreds = function(email, password, host) {
   // try{
    file.email = `${email}`;
    file.password = `${password}`;
    file.smtp = `${host}`;
    fs.writeFile(data, JSON.stringify(file ), (error) => {
        if (error) throw error;
      })
    console.log('filled autofill json file')
    //console.log(file.email, file.password, file.smtp);
//}
//catch(error){return `error editing autofill json`}
}

module.exports = {getCreds, fillCreds};
