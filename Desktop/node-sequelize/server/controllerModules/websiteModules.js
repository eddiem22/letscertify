const Website = require("../models").Website;
const generateHash = require('../utils/hashManager').hasher;
var randomRSAKeyGenerator = require("../utils/randomRSAKeyGenerator").getRandomPrime;
const fetch = require("isomorphic-fetch");
module.exports = {
  

    async updateWebsite(websiteToBeUpdated, req) {
        try{
          
          if(websiteToBeUpdated){
            await Website.update(
              {
                  securityFlag: req.body.securityFlag ? req.securityFlag : await fetch(`http://192.168.1.195:3456/api/website/check?URL=${URL}&command=-d%20-j`).then((result) =>{if(result['missing'].length> 5) {return false} else{return true}}),
                  categoryID: (!websiteToBeUpdated.categoryID && !req.body.categoryID) ? 1 : (!websiteToBeUpdated.categoryID && req.body.categoryID) ? req.body.categoryID : (websiteToBeUpdated.categoryID && !req.body.categoryID) ? websiteToBeUpdated.categoryID : 1,
                  RSA_Key: (!websiteToBeUpdated.RSA_Key && !req.body.RSA_Key) ? await randomRSAKeyGenerator([100,1000]) : (!websiteToBeUpdated.RSA_Key && req.body.RSA_Key) ? req.body.RSA_Key : (websiteToBeUpdated.RSA_Key && !req.body.RSA_Key) ? websiteToBeUpdated.RSA_Key : await randomRSAKeyGenerator([100,1000]),
                  fromwhitelist: (!websiteToBeUpdated.fromwhitelist && !req.body.fromwhitelist) ? 0 : (!websiteToBeUpdated.fromwhitelist && req.body.fromwhitelist) ? req.body.fromwhitelist : (websiteToBeUpdated.fromwhitelist && !req.body.fromwhitelist) ? websiteToBeUpdated.fromwhitelist : false,
                  hash: (!websiteToBeUpdated.hash && !req.body.hash) ? await generateHash(websiteToBeUpdated.URL)  : (!websiteToBeUpdated.hash && req.body.hash) ? req.body.hash : (websiteToBeUpdated.hash && !req.body.hash) ? websiteToBeUpdated.hash : await generateHash(websiteToBeUpdated.URL),
                },
                {
                where: {id: websiteToBeUpdated.id}
                }
            ).then(async(newWebsite) => {
              return newWebsite
            })
              }
              else{return false}
          }
          catch(e){
            console.log(e)
            //return e
          }
        },

        async createWebsite(req) {
            try {
                await Website.findOne({where:{URL: req.body.URL}}).then(async(duplicate) => {
                    if(duplicate) //IF DUPLICATE FOUND
                    {throw "duplicate!"}
            //IF NO DUPLICATE
            else{
                await Website.findOrCreate({where: {
                URL: req.body.URL,
                securityFlag: req.body.securityFlag ? req.body.securityFlag:  await fetch(`http://192.168.1.195:3456/api/website/check?URL=${req.body.URL}&command=-d%20-j`).then((result) => {if(result['missing'] >= 5) {return false} else{return true}}),
                categoryID: req.body.categoryID ? req.body.categoryID : 1,
                RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : await randomRSAKeyGenerator([100,1000]),
                fromwhitelist: req.body.fromwhitelist ? req.body.fromwhitelist : false,
                hash: req.body.hash ? req.body.hash : await generateHash(req.body.URL),
            }})
            .then(async(result) => {
                  created = result;
                  if(!created[1]) 
                  {
                    console.log("already exists")
                    return false;
                }
                  else{
                      console.log("created Website")
                      return true ;
                    }
                })
            }
        })
    }
         catch (e) {
                console.log(e)
                //return e
              }
            },

            async deleteWebsite(req) {
                try{ //TRY
                   await Website.findAll({where:{
           
                        URL: req.body.URL, }})
                                    
                  .then(async(websitesForDeletion) => {
                    for(website in websitesForDeletion)
                    {
                      if(website)
                    {await websitesForDeletion[website].destroy();}
                    else
                    {continue}
                    }
                    if(!Website.findOne({where:{URL:req.body.URL}}))
                    {return true}
                    else{return false}
                  })
                } //TRY
                catch(e)
                {
                    console.log(e)
                }
            },

}