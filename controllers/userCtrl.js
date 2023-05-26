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

// Update User
exports.updateUser = async (req, res) => {
    // extract the id param from the request URL param
    const id = req.params.id;
    const { currentUserId, currentUserAdmin, password } = req.body;
    

    if (id === currentUserId || currentUserAdmin) {
        // allow update if currentUserId matches URL ID or currentUserAdmin is true
        
      try {
        if (password) {
        // if the user is updating password return as hashed password
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(password, salt);
        }
  
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        // finds the user with the specified id and updates the fields provided in req.body
        if (user) { // if successful
          res.status(200).json(user);
        } else { // if user not found
          res.status(404).json('User Not Found');
        }
      } catch (error) { //server error
        res.status(500).json(error);
      }
    } else { // if user is not authorized to update
      res.status(403).json('Access Denied');
    }
  };

    // Delete a user
exports.deleteUser = async (req, res) => {
    // extract the id param from the request URL param
    const id = req.params.id;
  
    const { currentUserId, currentUserAdmin } = req.body;
  
    if (currentUserId == id || currentUserAdmin) {
        // allow update if currentUserId matches URL ID or currentUserAdmin is true

      try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json("User Deleted");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Access Denied");
    }
  };