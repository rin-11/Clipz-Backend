const User = require('../models/userModel')
const bcrypt = require("bcrypt");

// Get a User
exports.getUser = async (req, res) => {
  // extract the id param from the request params (req.params) & return userID
  try {
    const user = await User.findById(req.params.id); // Use req.params.id to retrieve the user ID from the URL
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const id = req.params.id;
  const { displayName, profilePicture } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json('User Not Found');
    }

    user.displayName = displayName || user.displayName;
    user.profilePicture = profilePicture || user.profilePicture;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
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

  // Get followers of a user
exports.getFollowers = async (req, res) => {
  // extracts the id parameter from the URL parameters of the request
  const id = req.params.id; 

  try {
    // find the user with the specified id in the database
    const user = await User.findById(id); 
    if (!user) {
      return res.status(404).json('User Not Found');
    }
  // get the follower users based on the IDs in the user's 'followers' array
    const followerUsers = await User.find({ _id: { $in: user.followers } }); 

    res.status(200).json(followerUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get users being followed by a user
exports.getFollowing = async (req, res) => {
  const id = req.params.id; 

  try {
    const user = await User.findById(id); 
    if (!user) {
      return res.status(404).json('User Not Found');
    }

    const followingUsers = await User.find({ _id: { $in: user.following } }); 

    res.status(200).json(followingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};