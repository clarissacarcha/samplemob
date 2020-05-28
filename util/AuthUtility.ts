import { AuthTokenModel } from '../rest-models/AuthTokenModel';
import crypto from 'crypto';
const bcrypt = require('bcrypt');

export class AuthUtility {

	static verifyAccess = async (token:string) =>{
		return await AuthTokenModel.verifyLogin(token);
	}

	static generateHash = (password:string) => {
		const saltRounds = 10;

	    return bcrypt.hashSync(password, saltRounds);
	}

}