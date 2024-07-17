import { JWTObject, config } from '@index/index';
const jwt = require('jsonwebtoken');

/*
 JWT Class is a class for generate access token, refresh token and any type of tokens &&
  verify if the current token 
  
*/

export function generateToken(JWTObject: JWTObject) {
  return jwt.sign(JWTObject, config.JWT.MAIN_TOKEN.SECRET_KEY, { expiresIn: config.JWT.MAIN_TOKEN.EXPIRE });
}

export function generateRefreshToken(JWTObject: JWTObject) {
  return jwt.sign(JWTObject, config.JWT.REFRESH_TOKEN.SECRET_KEY, { expiresIn: config.JWT.REFRESH_TOKEN.EXPIRE });
}

export function generateForgotPasswordToken(email: string) {
    return jwt.sign({email}, config.JWT.FORGOT_PASS_TOKEN.SECRET_KEY, { expiresIn: config.JWT.FORGOT_PASS_TOKEN.EXPIRE });
}

export function generateRegisterToken(JWTObject: JWTObject) {
  return jwt.sign(JWTObject, config.JWT.REGISTER_TOKEN.SECRET_KEY);
}


//Verify the refresh token
export function verifyRefreshToken(token:string) {
  try {
      return jwt.verify(token, config.JWT.REFRESH_TOKEN.SECRET_KEY);
  } catch (error) {
      return null;
  }
}

