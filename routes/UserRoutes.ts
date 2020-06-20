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
		  		.withMessage("Username is required")
		  	.isLength({max: 45})
		  		.withMessage("username should not exceed 45 characters"),
		  check("password")
		  	.notEmpty()
		  		.withMessage("Password is required")
		],
	User.login);


router.post(
	"/register", 
		[
		  check("accountType")
		  	.notEmpty()
		  		.withMessage("Accout type is required")
		  	.isInt({gt:0,lt:4})
		  		.withMessage("Account type is required"),
		  check("firstName")
		  	.notEmpty()
		  		.withMessage("First name is required")
		  	.isLength({max:45})
		  		.withMessage("Firstname cannot exceed 45 characters"),
		  check("middleName")
		  	.isLength({max:45})
		  		.withMessage("Middle name cannot exceed 45 characters"),
		  check("lastName")
		  	.notEmpty()
		  		.withMessage("Last name is required")
		  	.isLength({max:45})	
		  		.withMessage("Lastname cannot exceed 45 characters"),
		  check("email")
		  	.notEmpty()
		  		.withMessage("Email name is required")
		  	.isLength({max:100})
		  		.withMessage("Email cannot exceed 100 characters"),
		  check("password")
		  	.notEmpty()
		  		.withMessage("Password is required")
		],
	User.register);



/// code block below to be removed. Only being used fot testing

router.get(
	"/hash",
	User.hash);

//export routes
module.exports = router;