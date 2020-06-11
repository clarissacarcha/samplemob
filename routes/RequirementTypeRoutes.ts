//initialize router
import express from "express";
const router = express.Router();
//import model
import  { RequirementType }  from "../controllers/requirementType";

import {check, validationResult} from "express-validator"

//router definitions

router.post(
	"/create", 
		[
		  check("requirements")
		  	.notEmpty()
		  	.isLength({max: 45})
		  		.withMessage("value should not exceed 45 characters")
		],
	RequirementType.create);


router.get(
	"/read/:id", 
		[
			check('id')
				.notEmpty()
					.withMessage("ID is required")
				.isInt()
					.withMessage("Only number are allowed")
		], 
	RequirementType.read);


router.put(
	"/update", 
		[
		  check("id")
		  	.notEmpty()
		  		.withMessage("ID is required"),
		  check("requirements")
		  	.notEmpty()
		  	.isLength({max: 45})
		  		.withMessage("value should not exceed 45 characters")
		],
	RequirementType.update);


router.delete(
	"/delete/:id", 
		[
			check('id')
				.notEmpty()
					.withMessage("ID is required")
				.isInt()
					.withMessage("Only number are allowed")
		],
	RequirementType.delete);


router.post(
	"/list",
		[
			check("searchstring")
				.isLength({max: 45})
					.withMessage("value should not exceed 45 characters"),
			check("order")
				.notEmpty()
					.withMessage("Order field is required")
				.isInt({gt:-1, lt: 7})
					.withMessage("Filter out of range"),
			check("dir")
				.notEmpty()
					.withMessage("Order direction is required")
				.isInt({gt:-1, lt: 2})
					.withMessage(" valid values, 1 for asc, 0 for desc"),
			check("limit")
				.notEmpty()
					.withMessage("Limit is required")
				.isInt()
					.withMessage("Only numbers are allowed"),
			check("offset")
				.notEmpty()
					.withMessage("offset is required")
				.isInt()
					.withMessage("Only numbers are allowed"),
			check("token")
				.notEmpty()
					.withMessage("Authentication token required")
		],
	RequirementType.list);

//export routes
module.exports = router;