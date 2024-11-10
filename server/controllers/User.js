const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const createUser = async(req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // const hashedPassword = await bcrypt.hash(password, 10); 
      const user = new User({ username, password, email });
  await user.save();

      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      }); 
      const success = true;
      res.status(201).json({success, message: 'User registered',token:token });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' });
    }
  };


  const login = async(req,res)=> {
   try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
    const isMatch = await user.password === password;
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });  
    const success = true;
    res.json({ token ,success,user});
   } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
   }
  };

  const getAllUsers = async(req,res)=> {
    try {
    const response = await User.find({});    
     const success = true;
     res.json({response});
    } catch (error) {
         console.log(error)
         res.status(500).json({ message: 'Server error' });
    }
   };

module.exports = {createUser,login,getAllUsers}