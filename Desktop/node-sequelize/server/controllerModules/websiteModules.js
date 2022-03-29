const Website = require("../models").Website;
const Category = require("../models").Category;
const cron = require('node-cron');
const spawn = require("child_process").spawn;
const path = require('path');
const fs = require('fs');
const generateHash = require('../utils/hashManager').hasher;
var forge = require('node-forge');
var randomRSAKeyGenerator = require("../utils/randomRSAKeyGenerator").getRandomPrime;

module.exports = {

    async updateWebsiteModule(websiteToBeUpdated, req) {
        try{
          if(websiteToBeUpdated){
            await Website.update(
              {
                  securityFlag: (!websiteToBeUpdated.securityFlag && !req.body.securityFlag) ? 0 : (!websiteToBeUpdated.securityFlag && req.body.securityFlag) ? req.body.securityFlag : (websiteToBeUpdated.securityFlag && !req.body.securityFlag) ? websiteToBeUpdated.securityFlag : 0,
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
              else{return null}
          }
          catch(e){
            console.log(e)
            //return e
          }
        },

        async createWebsiteModule(req) {
            try {
                await Website.findOne({where:{URL: req.body.URL}}).then(async(duplicate) => {
                    if(duplicate){ //IF DUPLICATE FOUND
                    await Website.findOrCreate({where: {
                    URL: req.body.URL,
                    securityFlag: (!duplicate.securityFlag && !req.body.securityFlag) ? 0 : (!duplicate.securityFlag && req.body.securityFlag) ? req.body.securityFlag : (duplicate.securityFlag && !req.body.securityFlag) ? duplicate.securityFlag : 0,
                    categoryID: (!duplicate.categoryID && !req.body.categoryID) ? 1 : (!duplicate.categoryID && req.body.categoryID) ? req.body.categoryID : (duplicate.categoryID && !req.body.categoryID) ? duplicate.categoryID : 1,
                    RSA_Key: (!duplicate.RSA_Key && !req.body.RSA_Key) ? await randomRSAKeyGenerator([100,1000]) : (!duplicate.RSA_Key && req.body.RSA_Key) ? req.body.RSA_Key : (duplicate.RSA_Key && !req.body.RSA_Key) ? duplicate.RSA_Key : await randomRSAKeyGenerator([100,1000]),
                    fromwhitelist: (!duplicate.fromwhitelist && !req.body.fromwhitelist) ? 0 : (!duplicate.fromwhitelist && req.body.fromwhitelist) ? req.body.fromwhitelist : (duplicate.fromwhitelist && !req.body.fromwhitelist) ? duplicate.fromwhitelist : false,
                    hash: (!duplicate.hash && !req.body.hash) ? await generateHash(duplicate.URL)  : (!duplicate.hash && req.body.hash) ? req.body.hash : (duplicate.hash && !req.body.hash) ? duplicate.hash : await generateHash(duplicate.URL),
                }}).then(async(result) => {
                    created = result;
                    if(!created[1]) 
                    {
                      console.log("already exists")
                      return null;
                      //throw "ERROR: CANNOT ADD DUPLICATE ENTRY, CHECK ID AND NAME"
                  }
                    else{
                      var thisWebsite = result[0]
                        console.log("created Website")
                          return thisWebsite;
                      }
                  });
                }
            //IF NO DUPLICATE
            else{
                await Website.findOrCreate({where: {
                URL: req.body.URL,
                securityFlag: req.body.securityFlag ? req.body.securityFlag: 0,
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
                    return null;
                }
                  else{
                    var thisWebsite = result[0]
                      console.log("created Website")
                        return thisWebsite;
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

            async deleteWebsiteModule(req) {
                try{ //TRY
                   await Website.findOne({where:{
           
                        URL: req.body.URL,
                        /*
                        securityFlag: req.body.securityFlag ? req.body.securityFlag : true ,
                        categoryID: req.body.categoryID ? req.body.categoryID : 1,
                        RSA_Key: req.body.RSA_Key ? req.body.RSA_Key : null
                        */
                      }}
                  )
                  .then(async(websiteForDeletion) => {
                    if(!(await Website.findOne({websiteForDeletion})))
                    {return false}
                    else
                    {await websiteForDeletion.destroy(); return true}
                  })
                } //TRY
                catch(e)
                {
                    console.log(e)
                }
            },

}