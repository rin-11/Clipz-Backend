
// DEPENDENCIES
require("dotenv").config();

// pulls port from the .env file
const { PORT } = process.env;
// import express
const express = require("express");
// create application object
const app = express();


// Routes 
app.get("/", (req, res) => {
  res.send("app is working");
});


// Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
