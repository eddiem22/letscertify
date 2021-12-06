const express= require('express');
const cors = require("cors");
const Sequelize = require("sequelize");
const app = express();

var corsOptions = {
  origin: "http://localhost:9001"
};

app.use(cors(corsOptions));

app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
