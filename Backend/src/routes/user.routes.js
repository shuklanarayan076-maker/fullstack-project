const express = require('express');
const userController = require('../controllers/user.controller');
const identifyUser = require('../middlewares/auth.middleware');
const userRouter = express.Router();

userRouter.post("/follow/:username", identifyUser, userController.requestFollowController);
userRouter.get("/follow/requests", identifyUser, userController.getFollowRequestsController);
userRouter.patch("/follow/respond/:username", identifyUser, userController.respondToFollowRequestController);
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController);

module.exports = userRouter;