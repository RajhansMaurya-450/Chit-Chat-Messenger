const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const {generateToken} = require("../config/generateToken");

const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all feilds")
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        image,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.eamil,
            image: user.image,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("failed to insert user!");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            eamil: user.email,
            image: user.image,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or password");
    }
});

module.exports = { registerUser, authUser };
