const UserModel = require('../models/userModel')
const bcrypt = require("bcrypt");

// Export registerUser function as a named export
exports.registerUser = async (req, res) => {

    const { email, password, displayname } = req.body;
      // destructe & extract the email, password, &displayname properties from the req.body object 
      // assign the extracted values to corresponding variables

      // BCRYPT
        // generate a salt from bcrypt library
      const salt = await bcrypt.genSalt(10)
        // create variable for the hashed password 
      const hash = await bcrypt.hash(password, salt)

    // create a new instance of the UserModel using the extracted values 
    const newUser = new UserModel({ 
          email, 
          password:hash, // give password the value of hash
          displayname
        });
    
  // start a try block to handle potential errors 
    try {
      // save the user data to the database
      await newUser.save();
      // send success status code & newUser object in JSON format when registration is successful
      res.status(200).json(newUser); 
    } catch (error) { // if an error occurred during the registration process
      res.status(500).json({ message: error.message }); // send error status code
    }
  };

