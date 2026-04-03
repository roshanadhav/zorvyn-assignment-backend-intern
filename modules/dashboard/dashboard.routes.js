import express from 'express';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import {getSummary ,getRecentActivity ,getMonthlyTrends , getCategoryWise} from './dashboard.controller.js'
import userAuth from '../../middleware/auth.middleware.js';
const app = express();

const router = express.Router({mergeParams : true });


router.get('/'  , (req , res)=>{
    res.send("/dashbord")
})


router.get(
  "/summary",
  userAuth,
  authorizeRoles("admin", "analyst"),
  getSummary
);

router.get(
  "/category-wise",
  userAuth,
  authorizeRoles("admin", "analyst"),
  getCategoryWise
);

router.get(
  "/monthly",
  userAuth,
  authorizeRoles("admin", "analyst"),
  getMonthlyTrends
);

router.get(
  "/recent",
  userAuth,
  authorizeRoles("admin", "analyst"),
  getRecentActivity
);

export default router ; 