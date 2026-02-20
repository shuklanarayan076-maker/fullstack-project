const express = require("express")
const authController = require("../controllers/auth.controller")
const authRouter = express.Router() 
const identifyUser = require("../middlewares/auth.middleware")

authRouter.post("/register", authController.registerController )

authRouter.post("/login", authController.loginController)

authRouter.get("/get-me", identifyUser ,authController.getMeController)

module.exports = authRouter