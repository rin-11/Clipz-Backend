// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const multer = require('multer');

// Require Routes 
const userAuthRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const boardRoutes = require('./routes/boardRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const searchRoutes = require('./routes/searchRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const propicUploadRoutes = require('./routes/propicUploadRoutes');

// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static('public')); // Serve static files from the public directory
app.use('/inventory', express.static('public/inventory')); // Serve inventory files
app.use('/propic', express.static('public/propics')); // Serve profile pictures


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

// File storage configuration using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/propics');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Use Routes 
app.use('/auth', userAuthRoutes); // register/login
app.use('/user', userRoutes); // user requests (CRUD)
app.use('/board', boardRoutes); // board requests (CRUD)
app.use('/inventory', inventoryRoutes); // inventory requests
app.use('/upload', uploadRoutes) // upload requests
app.use('/propic', propicUploadRoutes); // Profile picture upload route
app.use('/search', searchRoutes); // search requests

// PORT
const PORT = process.env.PORT || 4000;
// Listener
app.listen(PORT, ()=>{
  console.log(`Server is listening on port ${PORT}`);
});