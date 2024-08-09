import fs from 'fs';

type DBType = "mysql" | "mariadb" | "postgres" | "sqlite" | "mssql" | "oracle" | "mongodb";

interface CompanyConfig {
    NAME: string;
    LOGO: string;
    BACKEND_HOST: string;
    FRONT_END_HOST: string;
    RESET_PASSWORD_URL: string;
    MAIN_COLOR: string;
    LANDING_PAGE: string;
}

interface HttpRequestConfig {
    PAGE_SIZE: number;
    PAGE_OFFSET: number;
    PAGE_OUT_JWT: string[];       
    PAGE_OUT_API_KEY: string[];  
}

interface ServerConfig {
    PORT: number;
    SECRET_API_KEY: string;
    VALIDATE_API_KEY: boolean;
    PASSWORD_SALT: string;
    IS_DEBUGGING: boolean;
    FAIL_LOGIN_MAX_NUMBER: number;
    DEFAULT_LANGUAGE: string;
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
}

interface FileConfig {
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

interface AppConfig {
    COMPANY: CompanyConfig;
    SERVER: ServerConfig;
    LOG: LogConfig;
    DB: DbConfig;
    HTTP_REQUEST: HttpRequestConfig;
    JWT: JwtConfig;
    FILE: FileConfig;
    EMAIL: EmailConfig;
}

class ConfigManager {
    private static instance: ConfigManager;
    private config: AppConfig;

    private constructor(configPath: string) {
        this.config = this.loadConfig(configPath);
    }

    public static getInstance(configPath: string): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager(configPath);
        }
        return ConfigManager.instance;
    }

    private loadConfig(configPath: string): AppConfig {
        if (!fs.existsSync(configPath)) {
            throw new Error(`Configuration file not found: ${configPath}`);
        }

        const configData = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(configData) as AppConfig;
    }

    public getConfig(): AppConfig {
        return this.config;
    }
}

export default ConfigManager;
