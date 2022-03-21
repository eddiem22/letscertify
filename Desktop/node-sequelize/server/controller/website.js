const Website = require("../models").Website;
const Category = require("../models").Category;
const getHashes = require("../utils").makeHashList;
var cron = require('node-cron');
const spawn = require("child_process").spawn;
const path = require('path');
const fs = require('fs');
const generateHash = require('../utils/hashManager').hash;
const ACCUMULATOR = path.join(__dirname, '../Accumulator.py');

//ONCE A DAY SCRIPT
cron.schedule('0 0 * * *', () => {
  this.fillHashes()
});
//ONCE A DAY SCRIPT


module.exports = {
  
  //GET ONE WEBSITE OR ALL OF TYPE
      async getAllWebsites(req, res) {

        //IF NOT ONLY HASH
        let Websites = await Website.findAll({where:{securityFlag: req.query.securityFlag ? req.query.securityFlag : 1, categoryID: req.query.categoryID ? req.query.categoryID : 1}})
        try {

          //IF FETCHALL
          if(req.query.fetchAll) {res.status(201).send(Websites)}
          //IF FETCHALL

          //else for fetchAll specifier check
          else{

          //IF NO URL, 404, ELSE FIND SINGLE WEBSITE WITH URL
          if(!req.query.URL){res.status(404).send("Please Enter URL")} else {let singleWebsite = await Website.findOne({where:{URL:req.query.URL}}); 
          //IF NO URL, 404, ELSE FIND SINGLE WEBSITE WITH URL

          //IF SINGLE WEBSITE FOUND
          if(singleWebsite){res.status(201).send(singleWebsite)}
          //IF SINGLE WEBSITE FOUND

          //IF NO SINGLE WEBSITE FOUND
          else{res.status(404).send("Website Not Found")}}
          //IF SINGLE WEBSITE FOUND

        }// end of else for fetchAll specifier check 
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
//GET ONE WEBSITE OR ALL OF TYPE

  //CREATE WEBSITE
      async createWebsite(req, res) {
        try {
          Website.sync().then(function() {
            if(req.body.url){
              generateHash(req.body.url).then((hex) =>
            Website.findOrCreate({where:{
            URL: req.body.URL,
            securityFlag: req.body.securityFlag ? req.body.securityFlag: 1,
            categoryID: req.body.categoryID ? req.body.categoryID: 1,
            RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null,
            Hash: hex
          }})).then(function(result) {
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
          }//if url 
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
          let website = await Website.findOne({
           where:{URL: req.body.URL}
          })
    
          if (website) {
            
            await Website.update({
             
                  securityFlag: req.body.securityFlag ? req.body.securityFlag : 1,
                  categoryID: req.body.categoryID ? req.body.categoryID : 1,
                  RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null,
                },
                {
                where: {URL: req.body.URL}
                }
            )
            let website = await Website.findOne({
              where:{URL: req.body.URL}})
    
            res.status(201).send(website)
          } else {
            res.status(404).send("Website Not Found")
          }
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
                securityFlag: req.body.securityFlag ? req.body.securityFlag : 1 ,
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


//FILL HASHES IF NULL
    async fillHashes(){
        let Hashes = getHashes()
        for(i in Hashes)
        {
          try {
            let website = await Website.findOne({
             where:{Hash: null}
            })
      
            if (website) {
              generateHash(website.url).then((hex) =>
              await Website.update({
                  Hash: hex
                  },
                  {
                  where: {Hash: website.Hash}
                  }
              ))
        }
        else{continue}
      }
      catch(e) {console.log(e)}
    }
    },
//FILL HASHES IF NULL


//UPDATE SINGLE HASH
    async updateSingleHash(oldHash, websiteHash) {
      try {
        let website = await Website.findOne({
         where:{Hash: websiteHash}
        })
  
        if (website) {
          await Website.update({
              Hash: websiteHash
              },
              {
              where: {Hash: oldHash}
              }
          )
    }
  }
  catch(e) {console.log(e)}
  },
//UPDATE SINGLE HASH


//GET RSA KEY
  async getKey(websiteHash){
    try {
      let website = await Website.findOne({
       where:{Hash: websiteHash}
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
  //SEND KEY TO ACCUMULATOR SCRIPT


    
    






  }

