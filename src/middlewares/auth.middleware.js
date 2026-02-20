const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

module.exports = async(req, res, next)=>{
    try
    {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer "))
        {
            return res.status(401).json({message: "Not Authorized"})
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if(!user)
        {
            return res.status(401).json({message: "user not found"})
        }

        req.user = user;
        next();
    }
    catch(err)
    {
        next(err);
    }
}