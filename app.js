import dotenv from 'dotenv'
import express from 'express' ; 
import userRouter from './modules/user/user.routes.js'
import recordRouter from './modules/record/record.routes.js'
import dashbordRouter from './modules/dashboard/dashboard.routes.js'
import cors from 'cors'
import connection from './config/db.js';
import authRouter from './modules/auth/authRouter.js';
import cookieParser from 'cookie-parser'
dotenv.config() ; 
const app = express() ; 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
connection() ; //db connection
app.use(cors({
    origin : '*' // kept all for testing perpose as assignment can be tested .
})) ; 

app.use('/user' , userRouter) ; 
app.use('/api/records' , recordRouter) ; 
app.use('/api/dashbord' , dashbordRouter) ; 
app.use('/api/auth' , authRouter); 


app.get('/' , (req , res)=>{
    res.send("thanks for visiting we are working on it documentation will shortly visible on same page")
})


app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(process.env.PORT || 3030 , ()=>{
    console.log("Server is Listning on port :" , process.env.PORT || 3030) ; 
})


