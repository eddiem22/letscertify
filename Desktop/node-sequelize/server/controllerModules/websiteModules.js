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
              else{throw "Website Not Found"}
          }
          catch(e){
            console.log(e)
            return e
          }
        },
}