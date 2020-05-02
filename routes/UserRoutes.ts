//initialize router
import express from "express";
const router = express.Router();
//import model
import  { User }  from "../controllers/user";

import {check, validationResult} from "express-validator"

//router definitions

router.post(
	"/login", 
		[
		  check("username")
		  	.notEmpty()
		  	.isLength({max: 45})
		  		.withMessage("value should not exceed 45 characters"),
		  check("password")
		  	.notEmpty()
		  		.withMessage("This field is required")
		],
	User.login);


router.get(
	"/hash",
	User.hash);

//export routes
module.exports = router;