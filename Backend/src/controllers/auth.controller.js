const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function registerController(req,res){
    const {email,username,password,bio,profileImage} = req.body
    // const isUserExistsByEmail = await userModel.findOne({email})

    // if (isUserExistsByEmail) {
    //     return res.status(409).json({
    //         message: "user already exists with same email"
    //     })
    // }

    // const isUserExistsByUsername = await userModel.findOne({username})

    // if(isUserExistsByUsername){
    //     return res.status(409).json({
    //         message:"user already exists by username"
    //     })
    // }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if (isUserAlreadyExists){
        return res.status(409).json({
            message:"user already exists" + isUserAlreadyExists.email==email ? "email already exists": "username already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    },process.env.JWT_SECRET,{expiresIn:"1d"}
)

res.cookie("token", token)

   res.status(201).json({
    message: "user registered successfully",
    user:{
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage
    }
   })
}

async function loginController(req,res){
    const {username,email,password} = req.body

    const user = await userModel.findOne({
        $or:[
            {
                username: username
            },
            {
                email: email
            }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message:"user not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message: "password is invalid"
        })
    }

     const token = jwt.sign({
        id: user._id, username: user.username
    },process.env.JWT_SECRET,{expiresIn:"1d"}
)

   res.cookie("token", token)

   res.status(200).json({
    message: "user loggedIn successfully",
    user:{
        username: user.username,
        email:user.email,
        bio: user.bio,
        profileImage: user.profileImage
    }
   })
}

async function getMeController(req,res){
    const userId = req.user.id
    const user = await userModel.findById(userId)

    res.status(200).json({
        user:{
            username: user.username,
            email:user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

module.exports = {
    registerController,
    loginController,
    getMeController
}