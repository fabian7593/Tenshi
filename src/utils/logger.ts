import * as fs from 'fs';
import * as path from 'path';
import { debuggingMessage } from './logsUtils';

// Ruta de la carpeta y el archivo de logs
const logDir = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDir, 'app.log');

// Verificar si la carpeta de logs existe, si no, crearla
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Verificar si el archivo de logs existe, si no, crearlo
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

// Función para escribir logs
const logger = (type: string, message: string) => {
  const logMessage = `${new Date().toISOString()} - ${type} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      debuggingMessage('Error writing to log file'+ err);
    }
  });
};

export default logger;
