const Website = require("../models").Website
const Category = require("../models").Category

module.exports = {
      async getAllCategories(req, res) {
        try {
          const Categories = await Category.find({})
    
          res.status(201).send(Categories)
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
    
      async createCategory(req, res) {
        try {
          let duplicate = Category.find({
            where:{Name: req.body.categoryName,
             id:req.body.categoryID,
                         }
          })
          if(!duplicate)
          {
          const category = await Category.create({
            Name: req.body.categoryName,
            categoryID: req.body.categoryID,
          })
    
          res.status(201).send(category)
        } //IF CATEGORY
        else{throw "ERROR: CANNOT ADD DUPLICATE ENTRY, CHECK ID AND NAME"}
        } catch (e) {
          console.log(e)
          res.status(400).send(e)
        }
      },
    
      async updateCategory(req, res) {
        try {
          const category = await Category.find({
            Name: req.params.oldName,
          })
    
          if (category) {
            const updatedCategory = await category.update({
                Name: req.params.newName,
            })
    
            res.status(201).send(updatedCategory)
          } else {
            res.status(404).send("Category Not Found")
          }
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
    }