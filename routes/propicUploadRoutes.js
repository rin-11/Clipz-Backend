const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import the uuid package

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/propics');
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}-${file.originalname}`; // Generate a unique file name using uuid
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('profilePicture'), (req, res) => {
  try {
    const fileName = req.file.filename; // Get the file name from the uploaded file
    return res.status(200).json({ fileName }); // Return the file name in the response
  } catch (error) {
    console.error(error);
    res.status(500).json('Profile Picture Upload Failed');
  }
});

module.exports = router;
