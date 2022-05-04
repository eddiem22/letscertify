const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var ip = require("ip");
const cors = require("cors");
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
require('./server/routes')(app);

const PORT = process.env.PORT || 3456;
const ADDRESS = ip.address();

app.listen(PORT, ADDRESS, () => {
    console.log(`Server is listening to port ${PORT}`)
})
