import * as fs from 'fs';
import * as path from 'path';
import { debuggingMessage } from './logsUtils';

// Función para obtener el nombre del archivo de logs con la fecha actual
const getLogFileName = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
  const yyyy = today.getFullYear();
  return `app_${dd}${mm}${yyyy}.log`;
};

// Ruta de la carpeta de logs
const logDir = path.join(__dirname, '../../logs');

// Verificar si la carpeta de logs existe, si no, crearla
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Obtener el nombre del archivo de logs con la fecha actual
const logFileName = getLogFileName();
const logFilePath = path.join(logDir, logFileName);

// Verificar si el archivo de logs existe, si no, crearlo
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

// Función para escribir logs
const logger = (type: string, message: string) => {
  const logMessage = `${new Date().toISOString()} - ${type} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      debuggingMessage('Error writing to log file: ' + err);
    }
  });
};

export default logger;
