const express = require('express')
const Sequelize = require("sequelize");
const websiteController = require("../controller").website
const categoryController = require("../controller").category

module.exports = app => {
    app.get("/api", (req, res) => {
      res.status(200).send({
        data: "Let's Certify Server",
      })
    })
  
    app.get("/api/website", websiteController.getWebsiteRequest)

    app.get("/api/website/RSA", websiteController.generateRandomKeys)

    app.get("/api/website/generateHashes", websiteController.generateHashes)
  
    app.post("/api/website/create", websiteController.createWebsiteRequest)

    app.get("/api/website/check", websiteController.checkSecurityRequest)
  
    app.put("/api/website/update", websiteController.updateWebsiteRequest)

    app.delete("/api/website/delete", websiteController.deleteWebsiteRequest)
  
    //app.get("/api/website/category", websiteController.getAllWebsitesOfCategory)
    
    //app.get("/api/website/securityFlag", websiteController.getAllWebsitesOfSecurityFlag)

    app.post("/api/category/create", categoryController.createCategory)

    app.get("/api/category", categoryController.getAllCategories)

    app.put("/api/category/:categoryID", categoryController.updateCategory)
  }