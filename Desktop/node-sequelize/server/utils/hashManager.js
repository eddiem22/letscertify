var forge = require('node-forge');

module.exports = {
     async hasher(data) {
      let createdHash = new Promise(function(resolve) {
      var md = forge.md.sha256.create();
      md.update(data)
      resolve(md.digest().toHex());
      });
      let hash = await createdHash;
      return hash;
}
}

