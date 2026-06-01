const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: {
            type: String,
            required: true,
            default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;