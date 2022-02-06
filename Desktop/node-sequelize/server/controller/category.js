const db = require("../models");
const Website = db.Website;
const Category = db.Category;


module.exports = {
      async getAllCategories(req, res) {
        try {
          const Categories = await Category.findAll(
            {where:{}}
          )
    
          res.status(201).send(Categories)
        } catch (e) {
          console.log(e)
    
          res.status(500).send(e)
        }
      },
    
      async createCategory(req, res) {
        try {
          Category.sync().then(function() {
            Category.findOrCreate({where:{
            Name: req.body.categoryName ? req.body.categoryName: undefined,
            id: req.body.categoryID ? req.body.categoryID : 1,
          }}).then(function(result) {
            var thisCategory = result[0],
            created = result[1];
            if(!created) {console.log("already exists")
            throw ("ERROR: CANNOT ADD DUPLICATE ENTRY, CHECK ID AND NAME")}
            else{res.status(201).send(thisCategory)
            console.log("created category")}
          });
          })
        }
           catch (e) {
          console.log(e)
          res.status(400).send(e)
        }
      },
    
      async updateCategory(req, res) {
        try {
          const category = await Category.findOne({
            where:{
            id: req.body.categoryID,
            Name: req.body.oldName,
          }})
    
          if (category) {
            const updatedCategory = await category.update({
              id: req.body.categoryID,
              Name: req.body.newName,
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