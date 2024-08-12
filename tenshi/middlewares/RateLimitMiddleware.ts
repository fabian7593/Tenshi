import { ConstStatusJson } from 'tenshi/consts/Const';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import ConfigManager  from "tenshi/config/ConfigManager";
import HttpAction from 'tenshi/helpers/HttpAction';
import { getIpAddress } from 'tenshi/utils/httpUtils';

/**
 * RateLimitMiddleware is a middleware function that limits the number of requests
 * that can be made by a client within a specified time period. It uses the 
 * rate-limiter-flexible library to enforce the rate limit.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export default function RateLimitMiddleware(req : Request, res: Response, next: NextFunction) {

    // Get the configuration object
    const config = ConfigManager.getInstance().getConfig();

    // Create an HttpAction object to handle the response
    const httpExec = new HttpAction(res);

    // Create a rate limiter with the maximum number of requests per second and the duration
    const rateLimiter = new RateLimiterMemory({
        points: config.SERVER.MAX_REQUEST_PER_SECOND,
        duration: 1, 
    });

    // Get the IP address of the request
    const ipAddress = getIpAddress(req);

    // Consume the request by the rate limiter
    rateLimiter.consume(ipAddress)
    .then(() => {
        // If the request is within the rate limit, call the next middleware function
        next(); 
    })
    .catch(() => {
        // If the request exceeds the rate limit, return a dynamic error response
        return httpExec.dynamicError(ConstStatusJson.TOO_MANY_REQUESTS);
    });
}
