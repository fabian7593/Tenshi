import fs from 'fs';

type DBType = "mysql" | "mariadb" | "postgres" | "mssql" ;

interface CompanyConfig {
    NAME: string;
    LOGO: string;
    BACKEND_HOST: string;
    FRONT_END_HOST: string;
    LOGIN_URL: string;
    RESET_PASSWORD_URL: string;
    MAIN_COLOR: string;
    BACKGROUND_COLOR: string;
    LANDING_PAGE: string;
}

interface HttpRequestConfig {
    PAGE_SIZE: number;
    PAGE_OFFSET: number;
    REQUEST_WITHOUT_JWT: string[];       
    REQUEST_WITHOUT_API_KEY: string[];  
}

interface ServerConfig {
    PORT: number;
    SECRET_API_KEY: string;
    VALIDATE_API_KEY: boolean;
    PASSWORD_SALT: string;
    IS_DEBUGGING: boolean;
    FAIL_LOGIN_MAX_NUMBER: number;
    DEFAULT_LANGUAGE: string;
    FORMAT_DATE: string;
    MAX_REQUEST_PER_SECOND: number;
    CUSTOMER_REGULAR_ROLE: string;
}

interface DbConfig {
    PORT: number;
    HOST: string;
    USER: string;
    PASSWORD: string;
    NAME: string;
    CONNECTION_LIMIT: number;
    TYPE: DBType;
}

interface JwtTokenConfig {
    EXPIRE: string | null;
    SECRET_KEY: string;
}

interface JwtConfig {
    MAIN_TOKEN: JwtTokenConfig;
    REFRESH_TOKEN: JwtTokenConfig;
    FORGOT_PASS_TOKEN: JwtTokenConfig;
    REGISTER_TOKEN: JwtTokenConfig;
}

interface GeneralFileConfig {
    MAX_FILE_SIZE: number;
}

interface AwsConfig {
    BUCKET_NAME: string;
    REGION: string;
    ACCESS_KEY: string;
    SECRET_ACCESS_KEY: string;
    PUBLIC_FOLDER: string;
    MINUTES_LIMIT_PRIVATE_FILE: number;
}

interface FileStorageConfig {
    GENERAL: GeneralFileConfig;
    AWS: AwsConfig;
}

interface LogConfig {
    LOG_SERVER: boolean;
    LOG_TRACEABILLITY: boolean;
    LOG_DATABASE: boolean;
    LOG_FILE: boolean;
}

interface EmailConfig {
    SERVICE: string;
    AUTH_USER: string;
    AUTH_PASSWORD: string;
    EMAIL_FROM: string;
}

interface UrlFilesConfig {
    SAVE_LOGS: string;
    REGEX_JSON: string;
    TEMPLATES_PATH: string;
    EMAIL_LANGUAGES_PATH: string;
    ROLES_JSON: string;
}

interface SuperAdminConfig {
    USER_EMAIL: string;
    PASSWORD: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    USERNAME: string;
}


interface AppConfig {
    COMPANY: CompanyConfig;
    SERVER: ServerConfig;
    LOG: LogConfig;
    DB: DbConfig;
    HTTP_REQUEST: HttpRequestConfig;
    JWT: JwtConfig;
    FILE_STORAGE: FileStorageConfig;
    EMAIL: EmailConfig;
    URL_FILES: UrlFilesConfig;
    SUPER_ADMIN: SuperAdminConfig;
}

class ConfigManager {
    private static instance: ConfigManager;
    private config: AppConfig;

    /**
     * Private constructor to ensure a singleton instance of the ConfigManager class.
     * @param {string} configPath - The path to the configuration file.
     */
    private constructor(configPath: string) {
        // Load the configuration file and store it in the 'config' property
        this.config = this.loadConfig(configPath);
    }

    public static getInstance(configPath?: string): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager(configPath!);
        }
        return ConfigManager.instance;
    }

    /**
     * Load configuration from the specified file path.
     *
     * @param {string} configPath - The path to the configuration file.
     * @returns {AppConfig} - The loaded configuration.
     * @throws {Error} - If the configuration file is not found.
     */
    private loadConfig(configPath: string): AppConfig {
        // Check if the configuration file exists
        if (!fs.existsSync(configPath)) {
            // Throw an error if the configuration file is not found
            throw new Error(`Configuration file not found: ${configPath}`);
        }

        // Read the configuration file and parse the JSON data
        const configData = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(configData) as AppConfig;
    }

    /**
     * Get the loaded configuration.
     *
     * @returns {AppConfig} The loaded configuration.
     */
    public getConfig(): AppConfig {
        // Return the loaded configuration
        return this.config;
    }
}

export default ConfigManager;
