const express = require('express');
const router = express.Router();
// multer is used for handling file uploads in Node.js
const multer = require('multer')


// file storage using Multer's diskStorage engine
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { // destination folder for storing uploaded files
      cb(null, "public/inventory");
    },
    filename: (req, file, cb) => { // filename to be used for each file
      cb(null, req.body.name);
    },
  });

// Multer middleware instance (pass instorage config)
const upload = multer({ storage: storage });


router.post("/", upload.single("file"), (req, res) => { // single file upload with the field name "file"
    try {
      return res.status(200).json("Successful Image Upload");
    } catch (error) {
      console.error(error);
      res.status(500).json("Image Upload Failed");
    }
  });

module.exports = router;
