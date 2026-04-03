import express from 'express';

const app = express();

const router = express.Router({mergeParams : true });

router.get('/'  , (req , res)=>{
    res.send("/user") ;
})


export default router ; 