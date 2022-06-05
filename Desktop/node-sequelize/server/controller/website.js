const Website = require("../models").Website;
const cron = require('node-cron');
const fs = require('fs');
const spawn = require("child_process").spawn;
const {exec} = require("child_process");
const path = require('path');
const securityCommand = require('../utils/askSecurityScript').securityCommand;
const generateHash = require('../utils/hashManager').hasher;
const ACCUMULATOR = path.join(__dirname, '../Accumulator/accumulator.py');
const MAINTENENCE= path.join(__dirname, '../securityScript.py');
var randomRSAKeyGenerator = require("../utils/randomRSAKeyGenerator").getRandomPrime;
const {updateWebsite, createWebsite, deleteWebsite} = require('../controllerModules/websiteModules')
const {Op} = require('sequelize');
  
//ONCE A DAY SCRIPT
cron.schedule('0 0 * * *', () => {
  exec(MAINTENENCE), function(err, stdout, stderr)
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
	if(req && typeof(req.query.URL) !== undefined){
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
          else
	  {
            await Website.findOne({where:
            {URL: typeof(String(req.query.URL).split(".")[1]) === undefined || (String(req.query.URL).split('')[1] && String(req.query.URL).split('.')[2] <= 4) ? req.query.URL : {[Op.like] : String(`%${req.query.URL}%`)}}})
          .then((async(singleWebsite) => { 
          if(singleWebsite) res.status(201).send(singleWebsite);
		    
          else res.status(404).send("Website Not Found");

          }))}}// end of else for fetchAll specifier check 
        }
	else res.status(404).send("Please Enter URL");
        }}
         catch (e) {
  	 res.status(404).send(e)
        }
      },
//GET ONE WEBSITE OR ALL OF TYPE

  //CREATE WEBSITE
         
  async createWebsiteRequest(req, res) {
    try {
      Website.sync().then(async() => {
        if(req){
        if(typeof(req.query.URL) !== undefined) {
	 await createWebsite(req).then(async(createdWebsite) => {
          if(createdWebsite)
          {
            res.status(201).send(`created Website successfully, ${createdWebsite}`)
          }
          else res.status(404).send("Error: Website Not Added, either already exists or an error exists in your request body");
        })
      }
     else res.status(404).send("Parse your JSON!!!"); 
      }
     else res.status(404).send("no request body provided"); 
      
    })}
       catch (e) {
      //console.log(e)
      res.status(400).send(e)
    }
  },
//CREATE WEBSITE
    

//UPDATE WEBSITE
      async updateWebsiteRequest(req, res) {
        try {
	if(typeof(req.query.URL) !== undefined && req) {
          await Website.findOne({
           where:{URL: {[Op.like] : String(`%${req.body.URL}%`)}}
          }).then(async(website) => {
          if(website) {
            updateWebsite(website, req).then(async(preview) => {
            res.status(201).send(preview);
          })
        }
        else res.status(404).send("Website Not Found");
          
        })}
	else res.status(404).send("Parse Your JSON!!!");
        } catch (e) {
          res.status(500).send(e)
        }
      },
//UPDATE WEBSITE 


//DELETE WEBSITE
    async deleteWebsiteRequest(req, res) {
      try { //TRY
	if(typeof(req.query.URL) !== undefined) {
          await deleteWebsite(req).then(async(websiteIsDeleted) => {
          if(!websiteIsDeleted) res.status(404).send("Website Was Not Deleted. Check your request parameters and try again. It may not exist in the database.");
         else res.status(201).send('Website Deleted!');
      })
	}
	else res.status(404).send("Parse Your JSON!!!"); 
      } //TRY
      catch (e) {
        //console.log(e)
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
      if(website.RSA_Key) return website.RSA_Key;
      else return;
  }
  else return;
}
catch(e) 
{//console.log(e)}},
  //GET RSA KEY


  //SEND KEY TO ACCUMULATOR SCRIPT
  async fromWhitelistRequest(req, res) {
if(!req || typeof(req.query.URL) === undefined) throw "No URL Entered!!!";
    try{
      let URL = req.query.URL
      let result = new Promise(function(resolve) {
      const python = spawn('python3', [ACCUMULATOR, `${URL}`]);
      python.stdout.on('data', (data) => {
       resolve(data.toString('utf8'));
   })
      python.stderr.on('data', (data) =>  {
        resolve(data.toString('utf8'))})

      python.stderr.on('close', () =>  {
        resolve("Process Closed Abruptly")})

   })
   let status = await result
   fs.writeFile((path.join(__dirname, 'accValue.txt')), status, err => {
	   if(err) 
	   {throw "Accumulator Value Not Found"}})
  //let AccValue = status.split('Website: :')
   //console.log('acc', status)
   //res.send(status)
   let proof = 'Proof.txt'
   res.download(proof, async function(err) {
     //console.log(err)
   })
   //console.log(status)
  }
catch(e)
{
  //console.log(e)
  res.status(404).send(e)
}  


},

 async getRSA(req, res) {
	//res.redirect('api/website/secret')
	let accValue = path.join(__dirname, 'accValue.txt');
	if(accValue) res.download(accValue, async function(err) {console.log(err)});
          
	else res.status(404).send("RSA Not Found");
 },


  async checkSecurityRequest(req, res) {
    try{
      let URL = req.query.URL
      let status = await securityCommand(URL);
      res.status(201).send(status);
      }
    catch(e)
    {
      //console.log(e);
      res.status(404).send("Unable To Access Website, Please Try Again Later!");
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
      else continue;
    
  }
})
}
  catch(e)
  {
    //console.log(e)
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
          else continue;
        }
      })}
    
    catch(e)
    {
     // console.log(e)
    }
    },
  }


    
    






  


