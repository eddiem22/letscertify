const path = require('path');
const SECURITY_SCRIPT = path.join(__dirname, '../shcheck.py');
const spawn = require("child_process").spawn;


module.exports = {

     async securityCommand(URL, command) {
        try{
        let result = new Promise(function(resolve) {
        const python = spawn('python3', [SECURITY_SCRIPT, `${URL}`, '-d', '-j']);
        python.stdout.on('data', (data) => {
         resolve(data.toString('utf8'));
     })
        python.stderr.on('data', (data) =>  {
          resolve(data.toString('utf8'))})

        python.stderr.on('close', () =>  {
          resolve("Process Closed Abruptly")})

     })
     let status = await result;
     return JSON.parse(status);
    }
      catch(e){
        console.log(e);
        res.status(404).send("Could Not Retrieve Website Domain")
     }
    }
    



}