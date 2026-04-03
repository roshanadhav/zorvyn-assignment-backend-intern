import jwt from 'jsonwebtoken'


import User from '../modules/user/user.model.js'  

const userAuth = async (req , res , next ) =>{
    const {token} = req.cookies ; 

    if(!token){
        return res.json({success : false , message : 'Not authrized Login Again'})
    }

    try {
        const tokendecode = jwt.verify(token , process.env.JWT_SECREAT) ; 

        if (tokendecode.id) {

            const user = await User.findById(tokendecode.id).select('-password')

            if (!user) {
                return res.json({success : false , message : 'User not found'})
            }

            req.user = user

            // (optional keep your old logic)
            req.body.userId = tokendecode.id; 
            
        }else{
            return res.json({success : false , message : 'Not authrized Login Again'})
        }

        next() ; 
    } catch (error) {
        return res.json({success  : false , message : error.message })
    }
}

export default userAuth ;
