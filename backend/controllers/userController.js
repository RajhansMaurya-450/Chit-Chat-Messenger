const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken");
const protect  = require("../middleware/authMiddleware");

const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, image } = req.body;
    console.log(image);
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
        image: image || undefined,
    });
    console.log(user);
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
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
            email: user.email,
            image: user.image,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or password");
    }
});

const allUsers = asyncHandler(async (req, res) => {
    console.log("alluser ke neeche"+req.query.search);
    const keyword = req.query.search
        ? {
            $or: [ //mogodb query for searching read docs...............
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = await User.find({ ...keyword }).find({ _id: { $ne: req.user._id } });
    
    // const users = await User.find({
    //...keyword,
    //_id: { $ne: req.user._id },

    // });
    console.log(users);
    res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
