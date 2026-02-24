const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true,"user name already exists"],
        required: [true,"user name is required"]
    },
    email:{
        type: String,
        unique:[true, "Email already exists"],
        required:[true,"Email is required"]
    },
    password: {
        type:String,
        required: [true,"password is required"],
        select: false
    },
    bio: String,
    profileImage: {
        type:String,
        default: "https://ik.imagekit.io/8emnmggso/default%20pic"
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel