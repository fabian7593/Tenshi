const jwt = require('jsonwebtoken');
require('dotenv').config();
import JWTObject from '../objects/JWTObject';

/*
 JWT Class is a class for generate access token, refresh token and any type of tokens &&
  verify if the current token 
  
*/

export function generateToken(JWTObject: JWTObject) {
  return jwt.sign(JWTObject, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });
}

export function generateRefreshToken(JWTObject: JWTObject) {
  return jwt.sign(JWTObject,  process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: process.env.JWT_REFRESH_EXPIRE });
}

export function generateForgotPasswordToken(email: string) {
    return jwt.sign({email},  process.env.JWT_FORGOT_PASSWORD_TOKEN, { expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRE });
}

export function generateRegisterToken(JWTObject: JWTObject) {
  return jwt.sign(JWTObject, process.env.JWT_REGISTER_TOKEN);
}


//Verify the refresh token
export function verifyRefreshToken(token:string) {
  try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  } catch (error) {
      return null;
  }
}

