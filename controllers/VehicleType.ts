import { VehicleTypeModel } from '../rest-models/VehicleTypeModel';

import { AuthUtility } from '../util/AuthUtility';

import {check, validationResult} from 'express-validator';

export class VehicleType{

  static create = async (req:any,res:any,next:any) =>{

    //validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await VehicleTypeModel.create(req.body);

    res.status(200).json({
        result
    });

  }

  static read = async (req:any,res:any,next:any) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await VehicleTypeModel.read(req.params.id);

    res.status(200).json({
        result
    });

  }

  static update = async (req:any,res:any,next:any) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await VehicleTypeModel.update(req.body);

    res.status(200).json({
      result
    });

  }

  static delete = async (req:any,res:any,next:any) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await VehicleTypeModel.delete(req.params.id);

    res.status(200).json({
      result
    });

  }


  static list = async (req:any,res:any,next:any) =>{

    //varify access
    let ress = await AuthUtility.verifyAccess(req.body.token);

    if(ress)
    {
      //validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let result = await VehicleTypeModel.list(req.body);

      res.status(200).json({
        result
      });
    }
    else{
      let result = {
        authError: 1,
        message: "You are not logged in"
      }
      res.status(200).json({
        result
      });
    }

  }

}
