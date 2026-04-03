import express from 'express'

import { login, logout, register, sendVerifyOTp, verifyEmail , isAuthenticated, resetPasswordOtpSender, verifyOtpTochengePassword } from './authController.js';
import  userAuth from '../../middleware/auth.middleware.js'
import { validate } from '../../middleware/validator.middleware.js';
import { registerUserSchema } from '../../validators/user.validator.js';

const authRouter  = express.Router({mergeParams:true})
authRouter.get('/' , (req , res)=>res.send("api is working"))
authRouter.post('/register' , validate(registerUserSchema),register)

authRouter.post('/login' , login) 

authRouter.post('/logout' , logout) ; 

authRouter.post('/send-verify-otp' , userAuth , sendVerifyOTp) ; 

authRouter.post('/verify-account' , userAuth, verifyEmail) ; 

authRouter.post('/is-auth' , userAuth, isAuthenticated) ; 

authRouter.post('/reset-pass-otp-send' , resetPasswordOtpSender) ; 

authRouter.post('/verify-otp-change-pass' , verifyOtpTochengePassword) ; 


export default authRouter ;