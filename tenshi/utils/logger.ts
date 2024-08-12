import * as fs from 'fs';
import * as path from 'path';
import { debuggingMessage } from 'tenshi/utils/logsUtils';
import ConfigManager  from "tenshi/config/ConfigManager";

/**
 * Function to get the current date and return it as a string in the format "app_DDMMYYYY.log".
 * @returns {string} The current date in the format "app_DDMMYYYY.log".
 */
const getLogFileName = () => {
  // Get the current date
  const today = new Date();

  // Get the day, month and year from the current date and pad them with leading zeros if necessary
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
  const yyyy = today.getFullYear();

  // Return the current date in the format "app_DDMMYYYY.log"
  return `app_${dd}${mm}${yyyy}.log`;
};

const config = ConfigManager.getInstance().getConfig();
const logDir = path.join(__dirname, config.URL_FILES.SAVE_LOGS);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFileName = getLogFileName();
const logFilePath = path.join(logDir, logFileName);

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

/**
 * Function to log a message with its type and timestamp.
 * 
 * @param {string} type - The type of the log message.
 * @param {string} message - The content of the log message.
 */
const logger = (type: string, message: string) => {
  // Create the log message with the current timestamp, type and message.
  const logMessage = `${new Date().toISOString()} - ${type} - ${message}\n`;

  // Append the log message to the log file.
  // If an error occurs, log it.
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      debuggingMessage('Error writing to log file: ' + err);
    }
  });
};

export default logger;
