const UserModel = require('../models/userModel')


// Get a User
exports.getUser = async (req, res) => {
    // extract the id parame from the request params (req.params) & return userID
    const id = req.params.id;
  
    try {
      const user = await UserModel.findById(id);
      if (user) { // if user is found by ID return user information
        const { password, ...otherDetails } = user._doc;
            // extracts the password from the user info before returning saving the rest of the user info as otherDetails
        res.status(200).json(otherDetails); // user details excluding the password
      } else {
        res.status(404).json("User Not Found");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

  // Get ALL users
  exports.getAllUsers = async (req, res) => {

    try {
      let users = await UserModel.find();
      users = users.map((user)=>{ // use the map function to iterate over each user in the users array found in mongoDB users
        const {password, ...otherDetails} = user._doc; // extracts the password from the user info before returning saving the rest of the user info as otherDetails
        return otherDetails; // user details excluding the password
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  };

