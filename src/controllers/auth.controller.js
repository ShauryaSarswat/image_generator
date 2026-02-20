const User = require("../models/user.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// generating token
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// register user

exports.register = async(req, res, next)=>{
    try
    {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            token: generateToken(user.__id)
        });
    }
    catch(err)
    {
        next(err);
    }
}

// login user

exports.login = async(req, res, next)=>{
    try
    {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(404).json({message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid Credentials"})
        }

        res.status(200).json({
            token: generateToken(user._id)
        });
    }
    catch(err)
    {
        next(err);
    }
}