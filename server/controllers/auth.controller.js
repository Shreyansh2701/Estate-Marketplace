const User = require("../models/user.model");
const bcrypt = require("bcryptjs");   

const signup = async (req, res, next) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        next(error);
    }
}

module.exports = signup;