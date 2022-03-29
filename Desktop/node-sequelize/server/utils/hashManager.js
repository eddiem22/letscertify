var forge = require('node-forge');

module.exports = {
     async hasher(data) {
       try{
      let createdHash = new Promise(function(resolve) {
      var md = forge.md.sha256.create();
      md.update(data)
      resolve(md.digest().toHex());
      });
      let hash = await createdHash;
      return hash;
    }
    catch(e) {
      throw('error: no URL entered in hashing function')
    }
}
}

