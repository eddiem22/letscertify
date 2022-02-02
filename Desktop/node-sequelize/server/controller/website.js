const Website = require("../models").Website
const Category = require("../models").Category

module.exports = {
      async getAllWebsites(req, res) {
        try {
          const Websites = await Website.findAll();
    
          res.status(201).send(Websites)
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },

      async getAllWebsitesOfCategory(req, res) {
        try {
          const category = await Category.find({
            id: req.params.categoryID,
          })

          if(category) {
            const websites = await Website.find({
              categoryID: req.params.categoryID,
            })

          res.status(201).send(websites)}
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
    
      async createWebsite(req, res) {
        try {
          const website = await Website.create({
            URL: req.body.URL,
            categoryID: req.body.categoryID,
            securityFlag: req.body.securityFlag,  
          })
    
          res.status(201).send(website)
        } catch (e) {
          console.log(e)
          res.status(400).send(e)
        }
      },
    
      async updateWebsite(req, res) {
        try {
          const website = await Website.find({
            URL: req.params.URL,
          })
    
          if (website) {
            const updatedWebsite = await User.update({
                securityFlag: req.params.securityFlag,
                categoryID: req.params.categoryID,
            })
    
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