const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var ip = require("ip");
console.log(ip.address());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

require('./server/routes')(app);

const PORT = 3456;
const ADDRESS = ip.address();
app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`)
})