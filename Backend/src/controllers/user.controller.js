const followModel = require('../models/follow.model');
const userModel = require('../models/user.model');

async function requestFollowController(req,res){
   const followerUsername = req.user.username
   const followeeUsername = req.params.username

   if(followeeUsername == followerUsername){
    return res.status(400).json({
        message: "you cannot follow yourself"
    })
   }

   const isFolloweeExists = await userModel.findOne({username: followeeUsername})

   if(!isFolloweeExists){   
    return res.status(404).json({
        message: `user ${followeeUsername} does not exist`
    })
   }

   const isAlreadyFollowing = await followModel.findOne({
    followers: followerUsername,
    followee: followeeUsername
   })
    if(isAlreadyFollowing){
       let message;
       switch(isAlreadyFollowing.status){
        case "pending":
            message = `you have already sent a follow request to ${followeeUsername}`
            break;
        case "accepted":
            message = `you are already following ${followeeUsername}`
            break;
        case "rejected":
            message = `your previous follow request to ${followeeUsername} was rejected`
            break;
       }
       return res.status(200).json({
        message: message,
        follow: isAlreadyFollowing
       })
    }
   const followRecord = await followModel.create({
    followers: followerUsername,
    followee: followeeUsername
   })

   res.status(201).json({
    message: `Follow request sent to${followeeUsername}`,
    follow: followRecord
   })
}

async function respondToFollowRequestController(req,res){
    const followeeUsername = req.user.username
    const followerUsername = req.params.username
    const {status} = req.body

    if(!["accepted", "rejected"].includes(status)){
        return res.status(400).json({
            message: "status must be either accepted or rejected"
        })
    }

    const followRequest = await followModel.findOne({
        followers: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    if(!followRequest){
        return res.status(404).json({
            message: `no follow request found from ${followerUsername} to ${followeeUsername}`
        })
    }

    followRequest.status = status
    await followRequest.save()

    res.status(200).json({
        message: `follow request from ${followerUsername} has been ${status}`,
        follow: followRequest
    })
}

async function getFollowRequestsController(req,res){
    const followeeUsername = req.user.username
    const followRequests = await followModel.find({
        followee: followeeUsername,
        status: "pending"
    })

    res.status(200).json({
        message: `pending follow requests for ${followeeUsername}`,
        followRequests: followRequests
    })
}

async function unfollowUserController(req,res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        followers: followerUsername,
        followee: followeeUsername
    })

    if(!isUserFollowing){
        return res.status(200).json({
            message: `you are not following ${followeeUsername}`
        })
    }

   await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `you have unfollowed ${followeeUsername}`
    })
}

module.exports = {
    requestFollowController,
    respondToFollowRequestController,
    getFollowRequestsController,
    unfollowUserController
}