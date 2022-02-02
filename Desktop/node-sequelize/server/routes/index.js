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
  
    app.get("/api/websites", websiteController.getAllWebsites)
  
    app.post("/api/website/create", websiteController.createWebsite)
  
    app.put("/api/website/:url", websiteController.updateWebsite)
  
    app.get("/api/:categoryId/websites", websiteController.getAllWebsitesOfCategory)
    
    app.post("/api/category/create", categoryController.createCategory)

    app.put("/api/:categoryID", categoryController.updateCategory)
  }