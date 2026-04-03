
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../modules/user/user.model.js';
import transpoter from '../../config/nodemailer.js';
import { WELCOME_EMAIL ,LOGO_URL ,OTP_VERIFICATION_EMAIL ,PASSWORD_RESET_OTP_EMAIL} from '../../config/email.config.js';
import dotenv from 'dotenv'
dotenv.config() ; 
//signup

export const  register = async (req  , res ) =>{
        const {name , password , email , role , adminPasskey } = req.body ; 
        if (!email || !name || !password) {
            return res.json({success : false , message : 'Missing Details'}) ;
        }
        try {
            const existingUser = await User.findOne({email : email}) ;
            if(existingUser){
                return res.json({success : false , message : 'User alredy exists'}) ;
            }

            let assignedRole = "viewer" ;
            let analystRequest = false ;

            // ADMIN LOGIC
            if (role === "admin") {
                if (adminPasskey !== process.env.ADMIN_PASSKEY) {
                    return res.json({success : false , message : 'Invalid Admin Passkey'})
                }
                assignedRole = "admin" ;
            }

            // ANALYST LOGIC
            else if (role === "analyst") {
                assignedRole = "viewer" ; // temporary
                analystRequest = true ;   // request pending
            }

            const hashPassword = await bcrypt.hash(password , 10) ; 

            const user = new User({
                name , 
                email , 
                password : hashPassword ,
                role : assignedRole ,
                analystRequest
            })

            await user.save() ; 

            const tokan = jwt.sign({id : user._id}, process.env.JWT_SECREAT , {expiresIn : '7d'}) ;
            res.cookie('token' , tokan , {
                httpOnly : true ,
                secure: (process.env.NODE_ENV == 'production') ? true : false ,
                sameSite : process.env.NODE_ENV == 'production' ? 'none' : 'strict' ,
                maxAge : 7*24*60*60*1000
            }) ;  

            // const mailOptions = {
            //     from : process.env.SENDER_EMAIL ,
            //     to : email ,
            //     subject : 'Welcome To Heartly' ,
            //     html: WELCOME_EMAIL.replace("{{email}}" , email ).replace("{{name}}" , user.name).replace("{{logo}}" , LOGO_URL)
            // }
            
            // await transpoter.sendMail(mailOptions) ; 

            return res.json({
                success : true , 
                message : role === "analyst" 
                    ? 'Request sent to admin for analyst role' 
                    : 'user signup Successfully'
            })

        } catch (error) {
            res.json({success : false , message : error.message})
        }
}

//login

export const login = async (req, res) => { 
    const {email , password}  = req.body ; 
    if (!email || !password) {
        return res.json({success : false , message : 'email and password are required' })
    }

    try {
        const user = await User.findOne({email}) ; 
        if (!user) {
            return res.json({success : false , message : 'user dose not exists with the given email'})
        }
        const isMache = await bcrypt.compare(password , user.password ) 
        
        if (!isMache) {
            return res.json({success : false , message : 'Invalid Password'})
        }

        const tokan = jwt.sign({id : user._id}, process.env.JWT_SECREAT , {expiresIn : '7d'}) ;
        res.cookie('token' , tokan , {
                httpOnly : true ,
                secure: (process.env.NODE_ENV == 'production') ? true : false ,
                sameSite : process.env.NODE_ENV == 'production' ? 'none' : 'strict' ,
                maxAge : 7*24*60*60*1000
        }) ;
        
        return res.json({success : true , message : 'user signin Successfully'})

    } catch (error) {
        return res.json({success : false , message : error.message }) ;
    }

}

//logout
export const logout = async (req, res) =>{
     try {
        res.clearCookie('token',{
                httpOnly : true ,
                secure: (process.env.NODE_ENV == 'production') ? true : false ,
                sameSite : process.env.NODE_ENV == 'production' ? 'none' : 'strict' ,
        })
        return res.json({success : true , message : 'user logged out successfully'})
     } catch (error) {
        return res.json({success : false , message : error.message}) ;
     }
}


// send Verification Otp To Users Email : 
export const sendVerifyOTp = async (req,res)=>{
    try {
        const {userId} = req.body ; 

        const user = await User.findById(userId) ;

        if (user.isveriFied) {
            return res.json({success : false , message : 'Account alredy verified'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp ; 
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000 ; 

        await user.save() ; 

        const mailOptions = {
            from : process.env.SENDER_EMAIL ,
            to : user.email ,
            subject : 'Account Varification OTP' ,
            html: OTP_VERIFICATION_EMAIL.replace("{{logo}}" , LOGO_URL).replace("{{name}}" , user.name).replace("{{otp}}" , otp)
        }

        await transpoter.sendMail(mailOptions) ;
        
        return res.json({success : true , message : 'otp sent sucessfully'})

    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}



// verify the otp : 
export const verifyEmail  = async (req , res )=>{
    const {userId , otp }  = req.body ; 

    if (! userId || ! otp ) {
        return res.json({success : false , message : 'Missing Details'}) ; 
    }


    try {
        const user = await User.findById(userId) ; 
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success : false , message : 'Invalid Otp'})
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success : false , message : 'OTP Expired'}) ; 
        }

        user.isveriFied = true ; 
        user.verifyEmail = '' ; 
        user.verifyOtpExpireAt = 0 ; 

        await user.save() ; 

        return res.json({success : true , message : 'email verified sucessfully'})

    } catch (error) {
        return res.json({success : false , message : error.message })
    }
}


// isAuthenticated : 
export const isAuthenticated = async (req , res)=>{
    try {
        return res.json({success : true }) ; 

    } catch (error) {
        return res.json({success : false , message : error.message })
    }
}

// Password reset otp : 
export const resetPasswordOtpSender = async (req , res) =>{

    const {email} = req.body ; 
    if (!email) {
        return res.json({success : false , message : 'Missing Email'})
    }
    try {
        const user = await User.findOne({email}) ; 
        if (!user) {
            return res.json({success : false , message : 'The account does not exists with the provided email'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp ; 
        user.restOtpExpireAt = Date.now() + 15 * 60 * 1000 ; 
        await user.save() ;

        const mailOptions = {
            from : process.env.SENDER_EMAIL ,
            to : user.email ,
            subject : 'Password Reset OTP' ,
            html: PASSWORD_RESET_OTP_EMAIL.replace("{{otp}}" , otp ).replace("{{name}}" , user.name).replace("{{email}}" , user.email)
        }
        await transpoter.sendMail(mailOptions) ;
        return res.json({success : true , message : 'otp sent sucessfully'})

        
    } catch (error) {
        return res.json({success : false , message : error.message})
    }



}


// verify otp to chenge password : 
export const verifyOtpTochengePassword = async (req,res) => {
    const {otp , email , password} = req.body ; 

    if (!email || !otp ||!password) {
        return res.json({success : false , message : 'missing credintials'})
    }

    try {
        const user = await User.findOne({email}) ; 
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success : false , message : 'Invalid Otp'})
        }

        if (user.restOtpExpireAt < Date.now()) {
            return res.json({success : false , message : 'OTP Expired'}) ; 
        }
        const hashPassword  = await bcrypt.hash(password , 15) ; 
        user.password = hashPassword ;
        user.resetOtp = '' ; 
        user.restOtpExpireAt = 0 ; 
        await user.save() ; 
        return res.json({success : true , message : 'password changed sucessfully'})

    } catch (error) {
        return res.json({success : false , message : error.message })
    }
}