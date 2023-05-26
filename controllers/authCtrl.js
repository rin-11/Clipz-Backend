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

// Export loginUser function as a named export
  exports.loginUser = async (req, res) => {
    // extract the email and password properties from the req.body using destructuring
    const { email, password } = req.body;
    try {
      // find user by email in the UserModel (mongoDB)
      const user = await UserModel.findOne({ email });
  
          // if the user exists compare username and password
          if (user) 
              {
              const validity = await bcrypt.compare(password, user.password)
              // use a ternary operator to check the value of validity-- 
              validity? res.status(200).json(user):res.status(400).json("Wrong Password")
              // if the user validity is true send user (200)
              // if the validity fails (username & password don't match) (400)
              } 
          else { // otherwise user not found
              res.status(404).json("User not found");
          }
      } catch (error) { // (Internal Server Error)
          res.status(500).json({message: error.message});
        }
      };