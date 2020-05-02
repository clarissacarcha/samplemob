//@ts-nocheck
import express, { Application } from "express";
import { Model } from 'objection';
import knex from "./config/knex";
import bodyParser from 'body-parser';


//import routes
import indexroute from './routes/index';
import vehicletyperoute from './routes/VehicleTypeRoutes';
import userroute from './routes/UserRoutes';

// Initialize express instance
const app: Application = express();

// Give knex instance to objection model
Model.knex(knex);

//-------------------- TEST STARTS HERE -------------------- //
/*import { User } from './models';

const testing = async () => {
  const res = await User.getUsersFiltered();
  console.log(JSON.stringify({users:res[0]}, null, 2))
}
testing();*/
//-------------------- TEST ENDS HERE -------------------- //

export default app;


app.use(bodyParser.json());

//allow cors
app.use((req,res,next) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS,GET,POST,PUT,PATCH,DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');

	next();
});

// assign routes
app.use('/sample', indexroute);

app.use('/vehicletype', vehicletyperoute);

app.use('/user', userroute);

