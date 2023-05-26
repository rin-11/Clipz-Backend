const User = require('../models/userModel')
const bcrypt = require("bcrypt");

// Get a User
exports.getUser = async (req, res) => {
    // extract the id param from the request params (req.params) & return userID
    const id = req.params.id;
  
    try {
      const user = await User.findById(id);
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
      let users = await User.find();
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
  
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
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
        await User.findByIdAndDelete(id);
        res.status(200).json("User Deleted");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Access Denied");
    }
  };

  // Follow User (add friend )
  exports.followUser = async (req, res) => {
    
    const id = req.params.id; // extracts the id parameter from the URL parameters of the request (this will be on a users profile so it will be the user to follows ID)
  
    const { currentUserId } = req.body; // extract the currentUserId property from the request body (represents the ID of the user performing the follow action)
    console.log(id, currentUserId); // log the values of id and currentUserId
  
    if (currentUserId == id) { // users cannot follow themselves
      res.status(403).json("Access Denied");
  
    } else { 
      try {
        const followUser = await User.findById(id); //find the user with the specified id in the database and assigns it to the followUser variable
        const followingUser = await User.findById(currentUserId); // find the user with the specified currentUserId (the user performing the follow action) in the database and assigns it to the followingUser variable
  
        if (!followUser.followers.includes(currentUserId)) { //checks if the currentUserId of the user performing the follow action is not already included in the followers array of the user being followed (followUser)
          await followUser.updateOne({ $push: { followers: currentUserId } }); // update the followers array of the user being followed (followUser) by adding the currentUserId of the user performing the follow action
          await followingUser.updateOne({ $push: { following: id } }); // update the following array of the user performing the follow action (followingUser) by adding the id of the user being followed
  
          res.status(200).json("User Followed"); // Successful follow
  
        } else {
          // user (currentUserId) already following user (id)
          res.status(403).json("Already Following User");
        }
      } catch (error) {
        // Internal Server Error
        console.log(error);
        res.status(500).json(error);
      }
    }
  };

// Unfollow User (Remove friend)
exports.unfollowUser = async (req, res) => { // extract the currentUserId property from the request body (represents the ID of the user performing the follow action)
    const id = req.params.id; // extracts the id parameter from the URL parameters of the request (this will be on a users profile so it will be the ID user of the user to unfollow)
    const { currentUserId } = req.body; // extract the currentUserId property from the request body (represents the ID of the user performing the unfollow action)
  
    if (currentUserId === id) { // users cannot unfollow themselves
      res.status(403).json("Access Denied");
    } else {
      try {
        const unfollowUser = await User.findById(id); //find the user with the specified id in the database and assigns it to the unfollowUser variable
        const unfollowingUser = await User.findById(currentUserId); // find the user with the specified currentUserId (the user performing the follow action) in the database and assigns it to the followingUser variable
  
        if (unfollowUser.followers.includes(currentUserId)) {
          await unfollowUser.updateOne({ $pull: { followers: currentUserId } }); // if the unfollowUser has currentUserId in its followers array -- remove currentUserId from its followers array using updateOne method with ($pull operator) 
          await unfollowingUser.updateOne({ $pull: { following: id } }); // the unFollowingUser removes id from its following array
          res.status(200).json("User Unfollowed");
        } else {
          res.status(403).json("User was not found in followers");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    }
  };


