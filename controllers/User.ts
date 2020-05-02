import { UserModel } from '../rest-models/usermodel';

import {check, validationResult} from 'express-validator';

const bcrypt = require('bcrypt');

export class User{

  static login = async (req:any,res:any,next:any) =>{

    //validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }

    let user = await UserModel.readFromUserName(req.body.username);
    let response = {};

    //user exists and is active
    if(user.length>0)
    {
      //validate password
      const match = await bcrypt.compare(req.body.password, user[0].password);

      if(match){
        response = {
          successful: 1,
          token: user[0].password
        }
      }
      else{
        response = {
          successful: 0,
          message: "Username and password did not match." 
        }
      }
    }
    else{
      response = {
        successful: 0,
        message: "Username and password did not match." 
      }
    }

    res.status(200).json({
        response
    });

  }

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
