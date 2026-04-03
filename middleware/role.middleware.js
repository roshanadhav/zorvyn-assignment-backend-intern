export const isAnalyst = (req , res , next) => {
    try {
        if (req.user.role !== 'analyst') {
            return res.json({success : false , message : 'Access Denied: Analyst only'})
        }
        next() ;
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}

export const isAdmin = (req , res , next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.json({success : false , message : 'Access Denied: Admin only'})
        }
        next() ;
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}


export const authorizeRoles = (...roles) => {
    return (req , res , next) => {
        if (!roles.includes(req.user.role)) {
            return res.json({success : false , message : 'Access Denied'})
        }
        next() ;
    }
}