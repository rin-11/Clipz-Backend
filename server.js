// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");


// Require Routes 
const userAuthRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const boardRoutes = require('./routes/boardRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const searchRoutes = require('./routes/searchRoutes')
const uploadRoutes = require('./routes/uploadRoutes')


// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static('public')); //  middleware serves static files from the public directory
app.use('/inventory', express.static('inventory')); // static files from the inventorydirectory

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
app.use('/user', userRoutes); // user requests (CRUD)
app.use('/board', boardRoutes); // board requests (CRUD)
app.use('/inventory', inventoryRoutes); // inventory requests
app.use('/upload', uploadRoutes) // upload requests
app.use('/search', searchRoutes); // search requests

// PORT
const PORT = process.env.PORT || 4000;
// Listener
app.listen(PORT, ()=>{
  console.log(`Server is listening on port ${PORT}`);
});