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
  
    app.put("/api/website/update/:URL", websiteController.updateWebsite)
  
    app.get("/api/website/category/:categoryID", websiteController.getAllWebsitesOfCategory)
    
    app.get("/api/website/securityFlag/:securityFlag", websiteController.getAllWebsitesOfSecurityFlag)

    app.post("/api/category/create", categoryController.createCategory)

    app.get("/api/category", categoryController.getAllCategories)

    app.put("/api/category/:categoryID", categoryController.updateCategory)
  }