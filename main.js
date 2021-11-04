const db = require('./src/config/db');
const Sequelize = require("sequelize");

const {
    writeURLS,
    checkWebsite,
    deleteWebsite,
    addWebsite,
    checkSafety,
    initializeCategories,
    listCategories,
    addCategory,
    resetCategories
  } = require('./src/helpers/dbFunctions');


  db.authenticate()
  .then(console.log('Database connected...'))
  .catch((err) => console.log('DB Error: ' + err.message));

//STARTS UP WITH APP AT LAUNCH EVERY TIME 

  //initializeCategories();
listCategories();
 //writeURLS();

//resetCategories();

//addCategory('Suspicious');

//TESTS

addWebsite('http://www.random.com')
addWebsite('http://www.test.com');
addWebsite('http://www.shouldbedeleted.com');
deleteWebsite('http://DoesNotExist.com');
deleteWebsite('http://www.shouldbedeleted.com');
deleteWebsite('http://www.random.com');
checkWebsite('http://www.test.com');
checkWebsite('http://www.notinDB.com');
checkSafety('http://www.facebook.com');
