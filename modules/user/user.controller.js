import User from "./user.model";


export const approveAnalyst = async (req , res) =>{
    try {
        const {userId} = req.body ;

        const user = await User.findById(userId) ;

        if (!user) {
            return res.json({success : false , message : 'User not found'})
        }

        if (!user.analystRequest) {
            return res.json({success : false , message : 'No analyst request found'})
        }

        user.role = "analyst" ;
        user.analystRequest = false ;

        await user.save() ;

        return res.json({success : true , message : 'User promoted to analyst'})
        
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}