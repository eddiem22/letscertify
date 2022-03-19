const Website = require("../models").Website;
const Category = require("../models").Category;
const getHashes = require("../utils").makeHashList;
var cron = require('node-cron');
const spawn = require("child_process").spawn;
const path = require('path');
const fs = require('fs');


//ONCE A DAY SCRIPT
cron.schedule('0 0 * * *', () => {
  this.fillHashes()
});
//ONCE A DAY SCRIPT


module.exports = {
  
  //GET ONE WEBSITE OR ALL OF TYPE
      async getAllWebsites(req, res) {
        let Websites = await Website.findAll({where:{securityFlag: req.query.securityFlag ? req.query.securityFlag : 1, categoryID: req.query.categoryID ? req.query.categoryID : 1, Hash: req.body.Hash ? req.body.Hash : null}})
        try {
          if(req.query.fetchAll) {res.status(201).send(Websites)}
          else{if(!req.query.URL){res.status(404).send("Please Enter URL")} else {let singleWebsite = await Website.findOne({where:{URL:req.query.URL}}); 
          if(singleWebsite){res.status(201).send(singleWebsite)}
          else{res.status(404).send("Website Not Found")}}
        }// end of else for fetchAll specifier check 
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
//GET ONE WEBSITE OR ALL OF TYPE

      /*
      async getAllWebsitesOfCategory(req, res) {
        try {
          Website.sync().then(function() {
          let thisCategory = Website.findAll({
            where:{categoryID: req.query.categoryID},
          })

          if(thisCategory) {
            let websites = Website.findAll({
              where:{categoryID: req.query.categoryID}
            })

          res.status(201).send(websites)
        }
        else{res.status(500).send("CANNOT FIND WEBSITE")}
       })
      }
        catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
      */

/*
      async getAllWebsitesOfSecurityFlag(req, res) {
        try {
          let matchedSecurityFlag =  Website.findAll({
            where:{securityFlag: req.body.securityFlag},
          })
          if (matchedSecurityFlag) {
            let websites = Website.findAll({
                where:{
                  securityFlag: req.body.securityFlag
                },
            })
            res.status(201).send(websites)
          } else {
            res.status(404).send("Security flag Not Found")
          }
        
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
      */

  //CREATE WEBSITE
      async createWebsite(req, res) {
        try {
          Website.sync().then(function() {
            Website.findOrCreate({where:{
            URL: req.body.URL,
            securityFlag: req.body.securityFlag ? req.body.securityFlag: 1,
            categoryID: req.body.categoryID ? req.body.categoryID: 1,
            RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null,
            Hash: req.body.Hash ? req.body.Hash : null
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
          let website = await Website.findOne({
           where:{URL: req.body.URL}
          })
    
          if (website) {
            await Website.update({
             
                  securityFlag: req.body.securityFlag ? req.body.securityFlag : 1,
                  categoryID: req.body.categoryID ? req.body.categoryID : 1,
                  RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null,
                  Hash: req.body.Hash ? req.body.Hash : null
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
              await Website.update({
                  Hash: Hashes[i]
                  },
                  {
                  where: {Hash: Hashes[i]}
                  }
              )
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
     const python = spawn('python3', [path.join(__dirname, '../Accumulator.py'), Key]);
     python.stdout.on('data', function(data) {
      return data.toString();
  } )
  },
  //SEND KEY TO ACCUMULATOR SCRIPT


    
    






  }

