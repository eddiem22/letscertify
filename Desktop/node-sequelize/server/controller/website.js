const Website = require("../models").Website;
const Category = require("../models").Category;
//const getHashes = require("../utils/getList").makeHashList;
const cron = require('node-cron');
const spawn = require("child_process").spawn;
const path = require('path');
const fs = require('fs');
const securityCommand = require('../utils/askSecurityScript').securityCommand;
const generateHash = require('../utils/hashManager').hasher;
const ACCUMULATOR = path.join(__dirname, '../Accumulator.py');
const SECURITY_SCRIPT = path.join(__dirname, '../securityScript.py');
var forge = require('node-forge');
var randomRSAKeyGenerator = require("../utils/randomRSAKeyGenerator").getRandomPrime;

//ONCE A DAY SCRIPT
/*cron.schedule('0 0 * * *', () => {
  this.fillHashes()
});
//ONCE A DAY SCRIPT
*/

module.exports = {
  
  //GET ONE WEBSITE OR ALL OF TYPE
      async getAllWebsites(req, res) {
        try {
        //IF NOT ONLY HASH

        let Websites = await Website.findAll({where:
          {securityFlag: req.query.securityFlag ? req.query.securityFlag : false, 
          categoryID: req.query.categoryID ? req.query.categoryID : 1 }})
        
          //IF FETCHALL
          if(req.query.fetchAll) {res.status(201).send(Websites)}
          //IF FETCHALL

          //else for fetchAll specifier check
          else{

          //IF NO URL, 404, ELSE FIND SINGLE WEBSITE WITH URL
          if(!req.query.URL){res.status(404).send("Please Enter URL")} else {await Website.findOne({where:{URL:req.query.URL}})
          .then((async(singleWebsite) => { 
          //IF NO URL, 404, ELSE FIND SINGLE WEBSITE WITH URL

          //IF SINGLE WEBSITE FOUND
          if(singleWebsite){res.status(201).send(singleWebsite)}
          //IF SINGLE WEBSITE FOUND

          //IF NO SINGLE WEBSITE FOUND
          else{res.status(404).send("Website Not Found")}
          //IF SINGLE WEBSITE FOUND
          
          }))}}// end of else for fetchAll specifier check 
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
//GET ONE WEBSITE OR ALL OF TYPE

  //CREATE WEBSITE
         
  async createWebsite(req, res) {
    try {
      let thisHash = await generateHash(`${req.body.URL}`)
      Website.sync().then(async function() {
        
        Website.findOrCreate({where:{
        URL: req.body.URL,
        securityFlag: req.body.securityFlag ? req.body.securityFlag: false,
        categoryID: req.body.categoryID ? req.body.categoryID: 1,
        RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : await randomRSAKeyGenerator([100,1000]),
        hash: thisHash,
        fromwhitelist: req.body.whitelist ? req.body.whitelist: false
      }}).then(function(result) {
        var thisWebsite = result[0],
        created = result[1];
        if(!created) 
        {
          console.log("already exists")
          throw ("ERROR: CANNOT ADD DUPLICATE ENTRY, CHECK ID AND NAME")
      }
        res.status(201).send(thisWebsite)
        console.log("created Website")
      });
      })
    }

       catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  },
//CREATE WEBSITE
    

//UPDATE WEBSITE
      async updateWebsite(req, res) {
        try {
          await Website.findOne({
           where:{URL: req.body.URL}
          }).then(async(website) => {
          if (website) {
            let preview = 
            await Website.update(
              {
                  securityFlag: (!website.securityFlag && !req.body.securityFlag) ? 0 : (!website.securityFlag && req.body.securityFlag) ? req.body.securityFlag : (website.securityFlag && !req.body.securityFlag) ? website.securityFlag : 0,
                  categoryID: (!website.categoryID && !req.body.categoryID) ? 1 : (!website.categoryID && req.body.categoryID) ? req.body.categoryID : (website.categoryID && !req.body.categoryID) ? website.categoryID : 1,
                  RSA_Key: (!website.RSA_Key && !req.body.RSA_Key) ? await randomRSAKeyGenerator([100,1000]) : (!website.RSA_Key && req.body.RSA_Key) ? req.body.RSA_Key : (website.RSA_Key && !req.body.RSA_Key) ? website.RSA_Key : await randomRSAKeyGenerator([100,1000]),
                  fromwhitelist: (!website.fromwhitelist && !req.body.fromwhitelist) ? 0 : (!website.fromwhitelist && req.body.fromwhitelist) ? req.body.fromwhitelist : (website.fromwhitelist && !req.body.fromwhitelist) ? website.fromwhitelist : false,
                  hash: (!website.hash && !req.body.hash) ? await generateHash(website.URL)  : (!website.hash && req.body.hash) ? req.body.hash : (website.hash && !req.body.hash) ? website.hash : await generateHash(website.URL),

                },

                {
                where: {URL: req.body.URL}
                }
            )
            
    
            res.status(201).send(preview)
              }
        else {
            res.status(404).send("Website Not Found")
          }
        })
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
//UPDATE WEBSITE 


//DELETE WEBSITE
    async deleteWebsite(req, res) {
      try {
          let websiteForDeletion = await Website.findOne({where:{
           
                URL: req.body.URL,
                securityFlag: req.body.securityFlag ? req.body.securityFlag : true ,
                categoryID: req.body.categoryID ? req.body.categoryID : 1,
                RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null
              }}
          )
          if(websiteForDeletion) {await websiteForDeletion.destroy()
  
          res.status(201).send('Website Deleted!')}
         else {
          res.status(404).send("Website Not Found")
        }
      } catch (e) {
        console.log(e)
  
        res.status(500).send(e)
      }
    },
//DELETE WEBSITE


//GET RSA KEY
  async getKey(websiteHash){
    try {
      let website = await Website.findOne({
       where:{hash: websiteHash}
      })

      if (website) {
      if(website.RSA_Key) {return website.RSA_Key}
      else{return null}
  }
  else{return null}
}
catch(e) {console.log(e)}
},
  //GET RSA KEY


  //SEND KEY TO ACCUMULATOR SCRIPT
  async fromWhitelist(Key) {
     const python = spawn('python3', [ACCUMULATOR, Key]);
     python.stdout.on('data', function(data) {
      return data.toString();
  } )
  },

  async checkSecurity(req, res) {
    let args = [];
    try{
    //if(req.query.URL) {
    //let website = await Website.findOne({where:{URL: req.query.URL}})
    //if (website) {
      if(req.query.command){ //if security script command field is selected
      args[0] = req.query.URL ? req.query.URL : null;
      args[1] = req.query.command;
      let status = await securityCommand(args);
      res.status(201).send(status);
      }
      else{throw "Command Not Found"}
    //}
 // }
    /*
    else{
      if(req.query.command){ //if security script command field is selected
        args[0] = '';
        args[1] = `${req.query.command}`;
        securityCommand(args)
        }
        else{throw "Command Not Found"}
    }
    */
  }
    catch(e)
    {
      console.log(e);
      res.status(404).send(e);
    }

  },

  async generateRandomKeys(){

    const range = [100, 1000];
    try{
    await Website.findAll({where:{}}).then(async(websites) => {

    for(website in websites)
    {
      if(website) {
      await randomRSAKeyGenerator([100,1000]).then(async(randomKey) => {

      Website.update({RSA_Key: randomKey}, {where:{id:websites[website].id}})})
      }
      else{continue}
    
  }
})
}
  catch(e)
  {
    console.log(e)
  }
  },

  async generateHashes(){
    try{
       await Website.findAll({where:{}}).then(async(websites) => {
      for(website in websites)
      {
        if(website) {await generateHash(websites[website].URL).then(async(newHash) => {
        
         Website.update(
          {
              hash: newHash
            },
            {
            where: {id:websites[website].id}
            }
        )
        })}
          else{continue}
        }
      })}
    
    catch(e)
    {
      console.log(e)
    }
    },
  


  //SEND KEY TO ACCUMULATOR SCRIPT


    
    






  }

