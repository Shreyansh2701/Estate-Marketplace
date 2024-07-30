const User = require("../models/user.model");
const bcrypt = require("bcryptjs");   
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
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

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({message: 'User not found', success: false});
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return next(errorHandler(401, 'Wrong credentials.'));
        }
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        const {password: pass , ...rest} = user._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

module.exports = { signup, signin };