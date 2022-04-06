const Website = require("../models").Website;
const cron = require('node-cron');
const spawn = require("child_process").spawn;
const {exec} = require("child_process");
const path = require('path');
const securityCommand = require('../utils/askSecurityScript').securityCommand;
const generateHash = require('../utils/hashManager').hasher;
const ACCUMULATOR = path.join(__dirname, '../Accumulator.py');
const SECURITY_SCRIPT = path.join(__dirname, '../securityScript.py');
var randomRSAKeyGenerator = require("../utils/randomRSAKeyGenerator").getRandomPrime;
const {updateWebsite, createWebsite, deleteWebsite} = require('../controllerModules/websiteModules')
const {Op} = require('sequelize');

//ONCE A DAY SCRIPT
cron.schedule('0 0 * * *', () => {
  exec(SECURITY_SCRIPT), function(err, stdout, stderr)
  { 
    stdout.on("data", data => {
      console.log(`Output: ${data.toString('utf8')}`);
    });

  stderr.on("data", data => {
      console.log(`An error occurred! Error Description: ${data.toString('utf8')}`);
  });
}
})
//ONCE A DAY SCRIPT


module.exports = {
  
  //GET ONE WEBSITE OR ALL OF TYPE
      async getWebsiteRequest(req, res) {
        try {
          if(req){
        if(req.query.fetchAll) {    
        await Website.findAll({
          where:
          {
            securityFlag: req.query.securityFlag ? req.query.securityFlag : {[Op.or] : [false, true]},
            categoryID: req.query.categoryID ? req.categoryID : {[Op.gte]: 1},
        }})
        .then(async(Websites) => {
          res.status(201).send(Websites)
        })}
          else{
          if(!req.query.URL)
          {res.status(404).send("Please Enter URL")} 
         //IF NO URL, 404, ELSE FIND SINGLE WEBSITE WITH URL
          else { 
            await Website.findOne({where:
              {
               URL: {[Op.substring] : String(req.query.URL).split(".")[1]}
          }})
          .then((async(singleWebsite) => { 
          //IF SINGLE WEBSITE FOUND
          if(singleWebsite){res.status(201).send(singleWebsite)}
          //IF SINGLE WEBSITE FOUND

          //IF NO SINGLE WEBSITE FOUND
          else{res.status(404).send("Website Not Found")}
          //IF SINGLE WEBSITE FOUND
          
          }))}}// end of else for fetchAll specifier check 
        }
        
        else{throw "No Request Body Provided"}
      }
         catch (e) {
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
            res.status(201).send("created Website successfully")
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
          if(!websiteIsDeleted) {res.status(404).send("Website Was Not Deleted. Check your request parameters and try again. It may not exist in the database.")}
         else {
          res.status(201).send('Website Deleted!');
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
  }


    
    






  

