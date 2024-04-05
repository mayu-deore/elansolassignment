// controllers/userController.js
const User = require('../models/user');

exports.getUserDetailsByEmail = async (req, res) => {
  try {
    const user = await User.getUserByEmail(req.params.email);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        ...user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
