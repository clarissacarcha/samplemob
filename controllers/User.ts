import { UserModel } from '../rest-models/usermodel';
import { AuthTokenModel } from '../rest-models/AuthTokenModel';

import {check, validationResult} from 'express-validator';
import crypto from 'crypto';

import { ServerResponse } from '../interfaces/ServerResponse'; 

const dateFormat = require('dateformat');
const bcrypt = require('bcrypt');


import { PersonModel } from '../rest-models/PersonModel'; 
import { CustomerModel } from '../rest-models/CustomerModel'; 

export class User{

  static login = async (req:any,res:any,next:any) =>{

    let status = 200;
    let user_data = {};
    //validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      status = 401;
      return res.status(200).json(
         new ServerResponse(
           status,
           {
             message: errors.array()
           }
         ).sendResponse()
      );
    }

    let user = await UserModel.readFromUserName(req.body.username);
    let message = "";

    //user exists and is active
    if(user.length>0)
    {
      //validate password
      const match = await bcrypt.compare(req.body.password, user[0].password);

      if(match){

        //create a token and send it to the client
        const date = dateFormat(new Date(), "yyyymmddhMMss");
        const sourceString = date+user[0].id;
        const token = crypto.createHash('sha256').update(sourceString).digest('hex');
        const roles = await UserModel.getUserRoles(user[0].id);
        //combine all permissions (tied to roles and to the user itself) in a string, separated bu comma
        const permissions = await UserModel.getUserPermissions(user[0].id,roles); 

        await AuthTokenModel.create(
          token,
          user[0].id,
          JSON.stringify(roles),
          JSON.stringify(permissions)
        );
        
        status = 200;
        message = "Login successful";
        user_data = {
          token: token,
          name: user[0].name,
          avatar: user[0].avatar,
          roles: roles,
          permissions: permissions
        }
      }
      else{
         status = 401;
         message = "Username and password did not match.";
      }
    }
    else{
      status = 401;
      message = "Username and password did not match.";
    }

    res.status(200).json(
        new ServerResponse(
           status,
           {
             message: [{msg:message}],
             user_data: user_data
           }
         ).sendResponse()
    );

  }


  static register = async (req:any,res:any,next:any) =>{

    let status = 200;
    let user_data = {};
    //validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      status = 422;
      return res.status(200).json(
         new ServerResponse(
           status,
           {
             message: errors.array()
           }
         ).sendResponse()
      );
    }

    // check if user already exists
    let user = await UserModel.readFromUserName(req.body.email);
    let message = "";
    let createdUserId = "";

    let token = "";
    const tempAvatar = "../assets/img/avatarplaceholder.png";
    const fullName = req.body.firstName+" "+req.body.middleName+" "+req.body.lastName;

    if(user.length>0){
      status = 422;
      message = req.body.email+" is already taken.";
    }
    // if not, create the user, log it in and return token
    else{

      createdUserId = await UserModel.create(req.body);
      message = "User created";

      req.body.userId = createdUserId;
      //create person record
      PersonModel.create(req.body);

      //create a consumer record
      CustomerModel.create(req.body);

      //create a token and send it to the client
      const date = dateFormat(new Date(), "yyyymmddhMMss");
      const sourceString = date+createdUserId;
      token = crypto.createHash('sha256').update(sourceString).digest('hex');
      const roles = await UserModel.getUserRoles(createdUserId);
      const permissions = await UserModel.getUserPermissions(createdUserId,roles);

      await AuthTokenModel.create(
        token,
        createdUserId,
        JSON.stringify(roles),
        JSON.stringify(permissions)
      );

      user_data = {
        token: token,
        name: fullName,
        avatar: tempAvatar,
        roles: roles,
        permissions: permissions
      }

      status = 200;
    }

    res.status(200).json(
        new ServerResponse(
           status,
           {
             message: [{msg: message}],
             user_data: user_data
           }
         ).sendResponse()
    );


  }



  /// code block below to be removed. Only being used fot testing

  static hash = async(req:any,res:any,next:any) => {
    const saltRounds = 10;
    const myPlaintextPassword = 'rexdiamante';

   /* bcrypt.genSalt(saltRounds, function(err:any, salt:any) {
    bcrypt.hash(myPlaintextPassword, salt, function(err:any, hash:any) {
          res.send(hash);
    });*/

    /*const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);*/

    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

    const match = await bcrypt.compare(myPlaintextPassword, hash);
 
    if(match) {
         res.send("matched"+hash);
    }
    else{
      res.send("not matched");
    }

  }

}
