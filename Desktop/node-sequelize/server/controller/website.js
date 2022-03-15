const Website = require("../models").Website
const Category = require("../models").Category

module.exports = {
      async getAllWebsites(req, res) {
        let Websites = await Website.findAll({where:{securityFlag: req.body.securityFlag ? req.body.securityFlag : 1, categoryID: req.body.categoryID ? req.body.categoryID : 1}})
        try {
          if(req.query.fetchAll) {res.status(201).send(Websites)}
          else{if(!req.query.URL){res.status(404).send("Please Enter URL")} else {let singleWebsite = await Website.findOne({where:{URL:req.query.URL,}}); 
          if(singleWebsite){res.status(201).send(singleWebsite)}
          else{res.status(404).send("Website Not Found")}}
        }// end of else for fetchAll specifier check 
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },


      /*
      async getAllWebsitesOfCategory(req, res) {
        try {
          Website.sync().then(function() {
          let thisCategory = Website.findAll({
            where:{categoryID: req.query.categoryID},
          })

          if(thisCategory) {
            let websites = Website.findAll({
              where:{categoryID: req.body.categoryID}
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
    
      async createWebsite(req, res) {
        try {
          Website.sync().then(function() {
            Website.findOrCreate({where:{
            URL: req.body.URL,
            securityFlag: req.body.securityFlag ? req.body.securityFlag: 1,
            categoryID: req.body.categoryID ? req.body.categoryID: 1,
            RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null
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
    
      async updateWebsite(req, res) {
        try {
          let website = await Website.findOne({
           where:{URL: req.body.URL}
          })
    
          if (website) {
            let updatedWebsite = await Website.update({
             
                  securityFlag: req.body.securityFlag ? req.body.securityFlag : 1,
                  categoryID: req.body.categoryID ? req.body.categoryID : 1,
                  RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null
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
    }
  }
