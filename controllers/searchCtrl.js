const User = require('../models/userModel');

// Search users based on username or email
exports.searchUsers = async (req, res) => {
  // Extract the search parameter from the request params
  const { search } = req.params;

  try {
    const users = await User.find({
      username: { $regex: search, $options: 'i' },
      email: { $regex: search, $options: 'i' },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};