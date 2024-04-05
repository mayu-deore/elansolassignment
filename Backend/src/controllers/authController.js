// controllers/authController.js

const bcrypt = require('bcrypt');
const User = require('../models/user'); // Ensure correct path to user.js

exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const dob = new Date(req.body.dob);
    // Ensure that createUser is a static method of the User class
    const newUser = await User.create({
      name: req.body.name,
      dob: req.body.dob,
      email: req.body.email,
      password_hash: hashedPassword,
    });

    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


// exports.login = async (req, res) => {
//   try {
//     const user = await User.getUserByEmail(req.body.email);

//     if (!user) {
//       return res.status(401).json({ success: false, error: 'Invalid email or password' });
//     }

//     const passwordMatch = await bcrypt.compare(req.body.password, user.password_hash);

//     if (!passwordMatch) {
//       return res.status(401).json({ success: false, error: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({
//       success: true,
//       user: {
//         user_id: user.user_id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         contact_number: user.contact_number,
//         user_type: user.user_type,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// };


exports.login = async (req, res) => {
    try {
      const { email, contact_number, password } = req.body;
  
      // Check if either email or contact_number is provided
      if (!email && !contact_number) {
        return res.status(400).json({ success: false, error: 'Email or contact_number is required' });
      }
  
      // Fetch user based on provided email or contact_number
      const user = email
        ? await User.getUserByEmail(email)
        : await User.getUserByContactNumber(contact_number);
  
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or contact_number' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!passwordMatch) {
        return res.status(401).json({ success: false, error: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({
        success: true,
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          contact_number: user.contact_number,
          user_type: user.user_type,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };