const UserModel = require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Export registerUser function as a named export
exports.registerUser = async (req, res) => {

  // const { email, password, username } = req.body;
  // destructe & extract the email, password, &username properties from the req.body object 
  // assign the extracted values to corresponding variables

  // BCRYPT
    // generate a salt from bcrypt library
    const salt = await bcrypt.genSalt(10)
    // create variable for the hashed password 
    const hash = await bcrypt.hash(req.body.password, salt)
    req.body.password = hash
  // create a new instance of the UserModel using the extracted values 
    const newUser = new UserModel(req.body);
    const {email, username} = req.body

  // start a try block to handle potential errors 
    try {
      // check if email/username is already registerred
      const existingUser = await UserModel.findOne({email, username})
      if(existingUser) 
        {
          return res.status(400).json({message:"Email/Username already exists"})
        }
        // save the user data to the database
      await newUser.save();
        
        // implement jwt to ensure only authorized users can access certain routes & actions
      const token = jwt.sign(
          { email: newUser.email, 
            username: newUser.username, 
            id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "3days" }
        );
      // send success status with token & user object
      res.status(200).json({ user: newUser, token })

        // send success status code & newUser object in JSON format when registration is successful
        // res.status(200).json(newUser); 
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
          if (user) {
              const validity = await bcrypt.compare(password, user.password)
              // use a ternary operator to check the value of validity-- 
              // if the validity fails (username & password don't match) (400)
              if (!validity) {
                res.status(400).json("Wrong Password");
              } else {
                const token = jwt.sign(
                  { email: user.email,  id: user._id },
                  process.env.JWT_SECRET,
                  { expiresIn: "3days" }
                );
                res.status(200).json({ user, token });
              }
           } else { // otherwise user not found
              res.status(404).json("User not found");
          }
      } catch (error) { // (Internal Server Error)
          res.status(500).json({message: error.message});
        }
      };