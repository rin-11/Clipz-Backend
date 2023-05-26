const UserModel = require('../models/userModel')


// Get a User
exports.getUser = async (req, res) => {
    // extract the id parame from the request params (req.params) & return userID
    const id = req.params.id;
  
    try {
      const user = await UserModel.findById(id);
      if (user) { // if user is found by ID return user information
        const { password, ...otherDetails } = user._doc;
            // extracts the password from the user info before returning
        res.status(200).json(otherDetails); // user details excluding the password
      } else {
        res.status(404).json("User Not Found");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };


