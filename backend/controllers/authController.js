const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    try{
        const { name, email, username, password } = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser)
        {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, username, password: hashedPassword});
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });
    }
    catch(error)
    {
        return res.status(500).json({ message: "Server error" });
    }
};


const loginUser = async (req, res) => {
    try{
        const{username, password} = req.body;
        const user = await User.findOne({username});

        if(!user)
        {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });
    }
    catch(error)
    {
        return res.status(500).json({ message: "Server error" });
    }
};



module.exports = {registerUser, loginUser};