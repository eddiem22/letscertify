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
  
    app.get("/api/website", websiteController.getAllWebsites)
  
    app.post("/api/website/create", websiteController.createWebsite)

    app.get("/api/website/check", websiteController.checkSecurity)
  
    app.put("/api/website/update", websiteController.updateWebsite)

    app.delete("/api/website/delete", websiteController.deleteWebsite)
  
    //app.get("/api/website/category", websiteController.getAllWebsitesOfCategory)
    
    //app.get("/api/website/securityFlag", websiteController.getAllWebsitesOfSecurityFlag)

    app.post("/api/category/create", categoryController.createCategory)

    app.get("/api/category", categoryController.getAllCategories)

    app.put("/api/category/:categoryID", categoryController.updateCategory)
  }