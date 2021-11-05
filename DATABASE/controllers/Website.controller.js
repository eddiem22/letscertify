const db = require("../models");
const fs = require('fs');

const { readdir } = require('fs').promises;
const Op = db.Sequelize.Op;
const path = require('path');

//const lists = require('../utils/getList');
//const whitelist = require('../config/test.txt');

const Website = db.Websites;
const { type } = require('os');




/*const readTextFile = function (req, res) {

    fs.readFile(path.join(__dirname, '../config/test.txt'), function (err, data) {
        if(err) {throw err;}
        else{
        const URLlist = data.toString().replace(/\r\n/g,'\n').split('\n');
        return URLlist;}
    
    }
    
    )};
*/

    //ADD URLS TO DATABASE FROM WHITELIST, ALL ASSUMED TO BE SAFE 
exports.writeURLS = async (req, res) => {
    var URLArray = [];
    const data = fs.readFileSync(path.join(__dirname, '../config/test.txt'), 'utf-8');
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    //const arr = readTextFile();
        for(let i of arr)  {
            console.log(i);
            var website =  await Website.findOne({
                where: { URL: i }
              });

              if(!website){
                   addWebsite(i);
                   website =  await Website.findOne({
                    where: { URL: i }})
                   .then(URLArray.push([website]))
                   .catch((err) => res.status(400).send({
      message: "Cannot Add Null Element" + err.message}));
              }
              
        }
       // return URLArray;
}
    
    
//end of initial URL database creation
exports.findAll = (req, res) => {
  const url = req.query.url;
  var condition = url? { URL: { [Op.like]: `%${url}%` } } : null;

  Website.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving websites."
      });
    });
};

////add website to DB ASSUMING IT PASSES SECURITY SCRIPTS
exports.addWebsite = async (req, res) => {
    if (!req.body.url) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }

      const url = {
        Name: req.body.name,
      };

     const type  = await Website.findOne( {where: {URL: url} } );
        if(!type){
            await Website.create({
                URL: url,
                securityFlag: true,
                fromWhitelist: true,
            })
            res.send({
              message: "website was added successfully!"
            });
        }
     
 };

 
////check if website is in DB
exports.checkWebsite = async (req, res) => {
  const url = req.params.url;
     const site = await Website.findOne({where: {URL:url} } )
      if (site) {
        res.send(site);
      } else {
        res.status(404).send({
          message: `Cannot find website with url=${url}.`
        });
      }
  };
  

 //delete website in DB
exports.deleteWebsite = async (req, res) => {
  const url = req.params.url;
    await Website.destroy({where: {URL:url} } )
    .then(num => {
      if (num == 1) {
        res.send({
          message: "website was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete website with url=${url}. Maybe website was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete website with url=" + url
      });
    });
};


//check website safety status
exports.checkSafety = async (req, res) => {
    const url = req.params.url;
    const site = await Website.findOne({where: {URL:url} } )
   .then(site => {
    if(site) {
        if(site.securityFlag== true)
            {
              res.send({
              message: "website HAS PASSED checks"
            });
          }
        else if(site.securityFlag == false)
        {
          res.send({
          message: "website has NOT PASSED checks"
        });
      }
    }
    })
.catch(err => {
  res.status(500).send({
    message: "Could not check website with url=" + url
  });
});
};
