import { ConstGeneral } from 'tenshi/consts/Const';
import { Request } from 'express';

/**
 * Retrieves the IP address of the request.
 * It checks for the IP address in different headers and falls back to the default value if not found.
 *
 * @param {Request} req - The request object.
 * @return {string} The IP address of the request.
 */
export function getIpAddress(req: Request): string {
    // Get the forwarded IP address from the header
    const forwardedFor = req.headers[ConstGeneral.HEADER_X_FORWARDED_FOR];
    let ipForwardedFor: string | null;

    // Check if the forwarded IP address is an array or not
    if (Array.isArray(forwardedFor)) {
        // If it is an array, use the first IP address
        ipForwardedFor = forwardedFor[0];
    } else {
        // If it is not an array, use it as is or assign null if it is undefined
        ipForwardedFor = forwardedFor || null;
    }

    // Get the IP address of the request
    const ipAddress = req.ip || // Use the IP address from the request object
                      ipForwardedFor || // Use the forwarded IP address if available
                      req.socket.remoteAddress || // Use the IP address from the socket object
                      req.connection.remoteAddress || // Use the IP address from the connection object
                      "unknown_ip"; // Use a default value if all above are not available

    return ipAddress;
}

