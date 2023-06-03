const User = require('../models/userModel')

// Search users based on email or ID
exports.searchUsers = async (req, res) => {
    // Extract the search parameter from the request query
    const { search } = String(req.query);

    try {
        const users = await User.find({
        // store user search in an array
        $or: [ // operator to search for users that match either the email or username
            // turn search into string and make case in-sensitive
            { email: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
        ],
        });
        if (users.length === 0) { // check the length of users array
            res.status(404).json({ message: 'Users not found' });
          } else {
            res.json(users);
          }

        } catch (error) {
            console.error( error);
            res.status(500).json(error);
        }
    };