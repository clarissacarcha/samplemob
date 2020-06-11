//initialize router
import express from "express";
const router = express.Router();
//import model
import  { VehicleModel }  from "../controllers/vehicleModel";

import {check, validationResult} from "express-validator"

//router definitions

router.post(
	"/create", 
		[
		  	check("model")
			  	.notEmpty()
			  		.withMessage("This field is required. ")
			  	.isLength({max: 45})
			  		.withMessage("Value should not exceed 45 characters."),
			check("model_year")
			  	.notEmpty()
			  		.withMessage("This field is required. ")
			  	.isInt({gt: 0, lt: 10000})
			  		.withMessage("Valid value: 1 - 9999.")
		],
	VehicleModel.create);


router.get(
	"/read/:id", 
		[
			check('id')
				.notEmpty()
					.withMessage("ID is required")
				.isInt()
					.withMessage("Only number are allowed")
		], 
	VehicleModel.read);


router.put(
	"/update", 
		[
		  	check("id")
		  		.notEmpty()
		  		.withMessage("ID is required"),
		  	check("model")
			  	.notEmpty()
			  		.withMessage("This field is required. ")
			  	.isLength({max: 45})
			  		.withMessage("Value should not exceed 45 characters."),
			check("model_year")
			  	.notEmpty()
			  		.withMessage("This field is required. ")
			  	.isInt({gt: 0, lt: 10000})
			  		.withMessage("Valid value: 1 - 9999")
		],
	VehicleModel.update);


router.delete(
	"/delete/:id", 
		[
			check('id')
				.notEmpty()
					.withMessage("ID is required")
				.isInt()
					.withMessage("Only number are allowed")
		],
	VehicleModel.delete);


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
	VehicleModel.list);

//export routes
module.exports = router;