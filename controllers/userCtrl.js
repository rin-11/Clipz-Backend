const UserModel = require('../models/userModel')

exports.registerUser = async (req, res) => {
    const { email, password, displayname } = req.body;
  
    const newUser = new UserModel({ email, password, displayname });
  
    try {
      await newUser.save();
      res.status(200).json(newUser); // success status code
    } catch (error) {
      res.status(500).json({ message: error.message }); // error status code
    }
  };

