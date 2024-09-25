import NodeCache from 'node-cache';
import ConfigManager  from "tenshi/config/ConfigManager";

const config = ConfigManager.getInstance().getConfig();
const cache = new NodeCache({ stdTTL: convertToSeconds(config.JWT.MAIN_TOKEN.EXPIRE!) });

/**
 * Blocks a given token. When a token is blocked, calls to the server will not
 * be allowed if the token is included in the request.
 * @param {string} token - The token to block.
 * @returns {Promise<void>} A promise that is resolved when the token has been
 *     blocked.
 */
export async function blockToken(token: string): Promise<void> {
  await cache.set(token, 'blocked');
}


/**
 * Checks if the given token is blocked.
 * @param {string} token - The token to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the token is blocked, false otherwise.
 */
export async function isTokenBlocked(token: string): Promise<boolean> {
  return await cache.get(token) === 'blocked';
}


/**
 * Converts a string in the format "Xs/m/h/d" to the equivalent number of seconds.
 * If the string does not match the expected format, returns 360 (i.e. 6 minutes).
 * @param {string} timeString - The string to convert.
 * @returns {number} The number of seconds corresponding to the input string.
 */
function convertToSeconds(timeString: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = timeString.match(regex);
  
    if (!match) {
      // If the string does not match the expected format, return 360 (i.e. 6 minutes).
      return 360;
    }
  
    const value = parseInt(match[1], 10);  
    const unit = match[2];
  
    // Convert the value to the equivalent number of seconds based on the unit.
    switch (unit) {
      case 's': 
        // Seconds
        return value;
      case 'm': 
        // Minutes
        return value * 60;
      case 'h': 
        // Hours
        return value * 60 * 60;
      case 'd': 
        // Days
        return value * 24 * 60 * 60;
      default:
        // If the unit is not recognized, return 360 (i.e. 6 minutes).
        return 360;
    }
  }
