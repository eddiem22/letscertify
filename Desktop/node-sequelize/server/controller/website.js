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
const { create } = require("domain");
var randomRSAKeyGenerator = require("../utils/randomRSAKeyGenerator").getRandomPrime;
const updateWebsite = require("../controllerModules/websiteModules").updateWebsiteModule;
const createWebsite = require("../controllerModules/websiteModules").createWebsiteModule;
const deleteWebsite = require("../controllerModules/websiteModules").deleteWebsiteModule;

//ONCE A DAY SCRIPT
/*cron.schedule('0 0 * * *', () => {
  this.fillHashes()
});
//ONCE A DAY SCRIPT
*/

module.exports = {
  
  //GET ONE WEBSITE OR ALL OF TYPE
      async getWebsiteRequest(req, res) {
        try {
       

        if(req.query.fetchAll) {
        
        await Website.findAll({where:
          {
            securityFlag: req.query.securityFlag ? req.query.securityFlag : false, 
            categoryID: req.query.categoryID ? req.query.categoryID : 1 }
        }).then(async(Websites) => {
          res.status(201).send(Websites)
        })}

          else{

          
          if(!req.query.URL)
          {res.status(404).send("Please Enter URL")} 
         //IF NO URL, 404, ELSE FIND SINGLE WEBSITE WITH URL
          else {await Website.findOne({where:{URL:req.query.URL}})
          .then((async(singleWebsite) => { 
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
         
  async createWebsiteRequest(req, res) {
    try {
      Website.sync().then(async() => {
        if(req){
        await createWebsite(req).then(async(createdWebsite) => {
          if(createdWebsite)
          {
            res.status(201).send(createdWebsite)
            console.log("created Website")
          }
          else{
            res.status(404).send("Error: Website Not Added, either already exists or an error exists in your request body")
          }
        })
      }
      else{res.status(404).send("no request body provided")}
      }) 
    }
       catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  },
//CREATE WEBSITE
    

//UPDATE WEBSITE
      async updateWebsiteRequest(req, res) {
        try {
          await Website.findOne({
           where:{URL: req.body.URL}
          }).then(async(website) => {
          if(website) {
            updateWebsite(website, req).then(async(preview) => {
            res.status(201).send(preview)
          })
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
    async deleteWebsiteRequest(req, res) {
      try { //TRY
          await deleteWebsite(req).then(async(websiteIsDeleted) => {
          if(websiteIsDeleted) {res.status(201).send('Website Deleted!')}
         else {
          res.status(404).send("Website Not Found")
        }
      })
      } //TRY
      catch (e) {
        console.log(e)
      }
    },
//DELETE WEBSITE



//GET RSA KEY
  async getKeyRequest(websiteHash){
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
  async fromWhitelistRequest(Key) {
     const python = spawn('python3', [ACCUMULATOR, Key]);
     python.stdout.on('data', function(data) {
      return data.toString();
  } )
  },

  async checkSecurityRequest(req, res) {
    let args = [];
    try{
      if(req.query.command){ //if security script command field is selected
      args[0] = req.query.URL ? req.query.URL : null;
      args[1] = req.query.command;
      let status = await securityCommand(args);
      res.status(201).send(status);
      }
      else{throw "Command Not Found"}

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

