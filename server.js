// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");


// Require Routes 
const userAuthRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')


// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// .env dependency PORT
require('dotenv').config();

// database connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //gets rid of deprecation warnings
// Mongo error/success messages
const db = mongoose.connection
db.on('error', (err) => console.log(`${err.message} MongoDB Not Running!`));
db.on('connected', () => console.log('mongo connected'));    
db.on('disconnected', () => console.log('mongo disconnected'));


// Use Routes 
app.use('/auth', userAuthRoutes); // register/login
app.use('/user', userRoutes); // 

// PORT
const PORT = process.env.PORT || 4000;
// Listener
app.listen(PORT, ()=>{
  console.log(`Server is listening on port ${PORT}`);
});