import { JWTObject } from '@index/index';
import jwt from 'jsonwebtoken';
import { default as config } from '@root/unbreakable-config';

class JWTService {
    private static instance: JWTService;

    private constructor() {}

    public static getInstance(): JWTService {
        if (!JWTService.instance) {
            JWTService.instance = new JWTService();
        }
        return JWTService.instance;
    }

    private generateTokenWithConfig(payload: object, secretKey: string, expiresIn?: string): string {
        return jwt.sign(payload, secretKey, expiresIn ? { expiresIn } : undefined);
    }

    public generateToken(JWTObject: JWTObject): string {
        return this.generateTokenWithConfig(JWTObject, config.JWT.MAIN_TOKEN.SECRET_KEY, config.JWT.MAIN_TOKEN.EXPIRE!);
    }

    public generateRefreshToken(JWTObject: JWTObject): string {
        return this.generateTokenWithConfig(JWTObject, config.JWT.REFRESH_TOKEN.SECRET_KEY, config.JWT.REFRESH_TOKEN.EXPIRE!);
    }

    public generateForgotPasswordToken(email: string): string {
        return this.generateTokenWithConfig({ email }, config.JWT.FORGOT_PASS_TOKEN.SECRET_KEY, config.JWT.FORGOT_PASS_TOKEN.EXPIRE!);
    }

    public generateRegisterToken(JWTObject: JWTObject): string {
        return this.generateTokenWithConfig(JWTObject, config.JWT.REGISTER_TOKEN.SECRET_KEY);
    }

    public verifyRefreshToken(token: string): JWTObject | null {
        try {
            return jwt.verify(token, config.JWT.REFRESH_TOKEN.SECRET_KEY) as JWTObject;
        } catch (error) {
            return null;
        }
    }
}

export default JWTService.getInstance();
