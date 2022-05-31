const Website = require("../models").Website;
const generateHash = require('../utils/hashManager').hasher;
var randomRSAKeyGenerator = require("../utils/randomRSAKeyGenerator").getRandomPrime;
var askSecurityScript = require("../utils/askSecurityScript").securityCommand;
const { securityCommand } = require("../utils/askSecurityScript");
module.exports = {

    async updateWebsite(websiteToBeUpdated, req) {
        try{
	if(typeof(req.query.URL) !== undefined) {
          if(websiteToBeUpdated){
            await Website.update(
              {
                  securityFlag: (req.body.securityFlag ?? websiteToBeUpdated.securityFlag) ?? false,
                  categoryID: (req.body.categoryID ?? websiteToBeUpdated.categoryID) ?? 1,
                  RSA_Key: (req.body.RSA_Key ?? websiteToBeUpdated.RSA_Key) ?? await randomRSAKeyGenerator([100,1000]),
                  fromwhitelist: (req.body.fromwhitelist ?? websiteToBeUpdated.fromwhitelist) ?? false,
                  hash: (req.body.hash ?? websiteToBeUpdated.hash) ?? await generateHash(websiteToBeUpdated.URL),
                },
                {
                where: {id: websiteToBeUpdated.id}
                }
            ).then(async(newWebsite) => {
              return newWebsite
            })
              }
              else return;
          }
	else throw "He cant keep getting away with this!!!";
	}
          catch(e){
            //console.log(e)
            //return e
          }
        },

        async createWebsite(req) {
            try {
		    
		if(typeof(req.body.URL) !== undefined) {
			
                await Website.findOrCreate({where: {
                URL: req.body.URL,
                securityFlag: req.body.securityFlag ?? false,
                categoryID: req.body.categoryID ?? 1,
                RSA_Key: req.body.RSA_Key ?? await randomRSAKeyGenerator([100,1000]),
                fromwhitelist: req.body.fromwhitelist ?? false,
                hash: req.body.hash ?? await generateHash(req.body.URL),
            }})
            .then(async(result) => {
                  created = result;
                  if(!created[1]) return;
                  else return true;
                })
            }
        })
}
	else throw "He cant keep getting away with this!!! Parse your JSON!!!";
    }
         catch (e) {
                //console.log(e)
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
                      if(website) await websitesForDeletion[website].destroy();
                    }
                    if(!Website.findOne({where:{URL:req.body.URL}})) return true;
                    else return false;
                  })
                } //TRY
                catch(e)
                {
                    //console.log(e)
                }
            },

}
