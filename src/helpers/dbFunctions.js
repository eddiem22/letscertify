const Sequelize = require('sequelize');
const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

//const lists = require('../utils/getList');
//const whitelist = require('../config/test.txt');

const Website = require('../models/Website.js');
const Category = require('../models/Category.js');
const { type } = require('os');



const initializeCategories = async () => {
    await Category.bulkCreate([
      { ID: 1, Name: 'Unvisited' },
      { ID: 2, Name: 'Unpopular' },
      { ID: 3, Name: 'Popular' }
    ]);
  };

  const addCategory = async (name) => {
      await Category.create(
          {Name: name}
      );
  };

  const listCategories = async () => {
    const Categories = await Category.findAll({ raw: true });
    console.log(Categories);
  }

  const resetCategories = async () => {
    await Category.destroy(
        {where: {} }
    )
    .then(initializeCategories());
};

const readTextFile = function () {

    fs.readFile(path.join(__dirname, '../config/test.txt'), function (err, data) {
        if(err) {throw err;}
        else{
        const URLlist = data.toString().replace(/\r\n/g,'\n').split('\n');
        return URLlist;}
    
    }
    
    )};

    //ADD URLS TO DATABASE FROM WHITELIST, ALL ASSUMED TO BE SAFE 
const writeURLS = async () => {
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
                   .catch((err) => console.log('Cannot Add Null Element' + err.message));
              }
              
        }
        return URLArray;
}
    
    
//end of initial URL database creation


////add website to DB ASSUMING IT PASSES SECURITY SCRIPTS
 const addWebsite = async (url, category) => {
    const type  = await Website.findOne( {where: {URL: url} } );
     if(category!=null) {
        const group = await Category.findOne( {where: {Name:category} } );
        if(!type){
            await Website.create({
                URL: url,
                securityFlag: true,
                fromWhitelist: true,
                CategoryID: group.ID,
            })
        }
     }
     else{
    if(!type){
        await Website.create({
            URL: url,
            securityFlag: true,
            fromWhitelist: true,
            CategoryID: 1,
        });
    }
}
     
 }
////check if website is in DB
 const checkWebsite = async (url) => {
     const site = await Website.findOne({where: {URL:url} } )
     if(site) 
        {return true;}
    else
        {return false;}
 }
  

 //delete website in DB
 const deleteWebsite = async (url) => {
    const site = await Website.findOne({where: {URL:url} } );
    if(site)
        {
           await Website.destroy( { where: { ID: site.ID } } ) 
        }
    else
        {return console.error('WEBSITE NOT FOUND')}
};



//check website safety status
const checkSafety = async (url) => {
   try{ const site = await Website.findOne({where: {URL:url} } )
    if(site)
        if(site.securityFlag== true)
            {console.log("Passed Security Check");
            return true;  }
        else if(site.securityFlag == false)
            {console.log("Did Not Pass Security Check");
            return false;}
}
    catch
        {return console.error('DOES NOT EXIST IN DB')};
    
}

module.exports = {
    writeURLS,
    addWebsite,
    deleteWebsite,
    checkWebsite,
    checkSafety,
    initializeCategories,
    listCategories,
    addCategory,
    resetCategories
};


