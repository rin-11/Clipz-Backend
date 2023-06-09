const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String
    },
    displayName: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
   profilePicture: String,
    followers: [],
    following: [],
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);
module.exports = User;