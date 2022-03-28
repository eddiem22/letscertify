const path = require('path');
const SECURITY_SCRIPT = path.join(__dirname, '../securityScript.py');
const spawn = require("child_process").spawn;


module.exports = {

     async securityCommand(Command) {
        try{
        let args = Command;
        let result = new Promise(function(resolve) {
        const python = spawn('python3', [SECURITY_SCRIPT, `${args[1]}`,]);
        python.stdout.on('data', function(data) {
         resolve(data.toString('utf8'));
     })
     })
     let status = await result;
     return status;
    }
      catch(e){
        console.log(e);
        //res.status(404).send("Could Not Retrieve Website Domain")
     }
    }
    



}