const Website = require("../models").Website
const Category = require("../models").Category

module.exports = {
      async getAllWebsites(req, res) {
        let Websites = await Website.findAll();
        try {
          if(req.body.fetchAll) {res.status(201).send(Websites)}
          else{let singleWebsite = await Website.findOne({where:{URL:req.body.URL}}); 
          if(singleWebsite){res.status(201).send(singleWebsite)}
          else{res.status(404).send("Website Not Found")}
        }// end of else for fetchAll specifier check 
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },

        async getWebsite(req, res) {
          try 
          {
            Website.sync().then(function() {
            let thisWebsite = Website.findOne(
              {
                where:{URL: req.params.URL,
                //include: [Website],
                //limit: 1
                }
              })

              if(thisWebsite)
              {
                /*
                let found = await Website.findOne(
                  {
                    where:{URL: thisWebsite.URL,
                      id: thisWebsite.id,
                      categoryID: thisWebsite.categoryID ? thisWebsite.categoryID : 1,
                      securityFlag: thisWebsite.securityFlag,
                    include: [Website],
                    limit: 1
                    }
                  })
                  */
                console.log(thisWebsite)
                res.status(201).send(thisWebsite)
              }
              else {res.status(404).send("Website Not Found")}
            })
          } catch (e) {
            console.log(e)
            res.status(500).send(e)
          }
        
          },

      async getAllWebsitesOfCategory(req, res) {
        try {
          Website.sync().then(function() {
          let thisCategory = Website.findAll({
            where:{categoryID: req.params.categoryID},
          })

          if(thisCategory) {
            let websites = Website.findAll({
              where:{categoryID: req.params.categoryID}
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

      async getAllWebsitesOfSecurityFlag(req, res) {
        try {
          Website.sync().then(function() {
          let matchedSecurityFlag =  Website.findOne({
            where:{securityFlag: req.params.securityFlag},
          })
          if (matchedSecurityFlag) {
            let websites = User.findAll({
                where:{
                  securityFlag: req.params.securityFlag
                },
            })
    
            res.status(201).send(websites)
          } else {
            res.status(404).send("Security flag Not Found")
          }
        })
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
      
    
      async createWebsite(req, res) {
        try {
          Website.sync().then(function() {
            Website.findOrCreate({where:{
            URL: req.body.URL,
            securityFlag: req.body.securityFlag ? req.body.securityFlag: 1,
            categoryID: Category.findOrCreate({where:{id:req.body.categoryID ? req.body.categoryID: 1}}) ? req.body.categoryID: 1 
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
           where:{URL: req.params.URL}
          })
    
          if (website) {
            let updatedWebsite = await User.update(
              {
                  securityFlag: req.params.securityFlag,
                  categoryID: req.params.categoryID
                }
            )
    
            res.status(201).send(updatedWebsite)
          } else {
            res.status(404).send("Website Not Found")
          }
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
    }