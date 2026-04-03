import express from 'express';
import userAuth from '../../middleware/auth.middleware.js';
import { createRecord , getRecords , updateRecord , softDeleteRecord} from './record.controller.js';
import { isAdmin , authorizeRoles} from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validator.middleware.js';
import { createRecordSchema, updateRecordSchema } from '../../validators/record.validator.js';

const app = express();

const router = express.Router({mergeParams : true });

//create record 

router.post(
  "/create",
  validate(createRecordSchema),
  userAuth,
  isAdmin ,
  createRecord
);

router.get(
  "/",
  userAuth,
  authorizeRoles("admin", "analyst"),
  getRecords
);

router.patch(
  "/:id",
  userAuth,
  validate(updateRecordSchema) ,
  authorizeRoles("admin"),
  updateRecord
);

router.delete(
  "/:id",
  userAuth,
  authorizeRoles("admin"),
  softDeleteRecord
);

export default router ; 