# Tenshi JS

Tenshi is a modular and scalable backend REST API framework developed in Node.js with TypeScript and Express.js. It is **completely open-source** and designed to facilitate the development of robust applications through a clean and modular architecture. Tenshi focuses on providing a structured environment to manage users, permissions, roles (via JSON format), documents, logs, emails, notifications, and other essential modules for backend development.

<br><br>

## Key Features of TenshiJS

### General
- Rapid development of robust backend REST APIs with essential security validations.
- Generic classes for controllers and repositories, easily adaptable to any entity.
- Modular architecture, enabling the use of only necessary modules and the creation of microservices.
- Comprehensive error handling, logging, and traceability.
- Role management through a JSON file.
- Email module supporting individual or bulk email sending.
- Multi-language support for emails and notifications.

### Security
- Password encryption and protection of critical data.
- Privacy management for specific files.
- JWT management with expiration limits and separate handling for different requests like user registration or password reset.
- API key validation.
- Request throttling to prevent DDoS attacks.
- Security headers via Helmet.

### Validations
- JWT validation.
- API key validation.
- Regex validation.
- Required fields validation.
- Query parameters validation.
- DTOs for body validation and response data.
- Role and user permissions validation for executing requests.

### Document Management
- Administration of documents (currently supports AWS).
- Insertion, update, and deletion of documents.
- Creation of public or private documents.
- Assignment of documents to specific tables and/or users.

### Modules
- Users
- Logs
- Email
- Notifications
- UDC (Unit Dynamic Central)
- Document Management

<br><br>

## Installation
Tenshi is a highly flexible framework, not just a library. To get started:

1. Ensure you have the following installed:
   - Node.js
   - NPM
   - Git

2. Clone the repository:
   ```bash
   git clone https://github.com/fabian7593/Tenshi.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Scripts to start the server:
   you can see the package.json to see another scripts
   ```bash
   //this is for compile the project completely
   npm run compile

   //this is for start server in development environment
   npm run dev

   //this is for start server in production environment
   npm run start
   ```

<br><br>

## Configuration:
Tenshi allows intuitive project configuration via the `tenshi-config.json` file, which is divided into the following sections:



### 1. **COMPANY**
This section contains relevant information about the company and associated URLs.

- **NAME**: The name of the company. In this case, "Tenshi".
- **LOGO**: URL pointing to the location of the company's logo.
- **BACKEND_HOST**: Base URL of the backend, typically the address where the backend server is hosted.
- **FRONT_END_HOST**: Base URL of the frontend, usually the address where the frontend server or web application is hosted.
- **LOGIN_URL**: URL of the system's login page.
- **RESET_PASSWORD_URL**: Specific route for the password reset page.
- **MAIN_COLOR**: Primary brand color used in user interfaces and emails.
- **BACKGROUND_COLOR**: Primary background color used in the user interface and emails.
- **LANDING_PAGE**: URL of the company's landing page, typically used for emails.

### 2. **SERVER**
Configuration related to the server.

- **PORT**: (number) The port on which the backend server listens for incoming requests.
- **SECRET_API_KEY**: Secret key used to authenticate API requests.
- **VALIDATE_API_KEY**: (bool) Indicates if the server should validate the API key for incoming requests.
- **PASSWORD_SALT**: (32 length string) A salt used for secure password encryption.
- **MAX_REQUEST_PER_SECOND**: Maximum number of requests allowed per second, used to prevent denial of service (DoS) attacks.
- **IS_DEBUGGING**: (bool) Indicates if the server is in debugging mode, which typically provides more detailed error information and logs.
- **FAIL_LOGIN_MAX_NUMBER**: Maximum number of failed login attempts before blocking or taking action.
- **DEFAULT_LANGUAGE**: (2 letters language) Default language of the server.
- **FORMAT_DATE**: Date format used for localization, e.g., "es-ES" for Spanish (Spain).

### 3. **DB**
Configuration related to the database.

- **TYPE**: Type of database being used. Options include "mysql" | "mariadb" | "postgres" | "mssql".
- **PORT**: (number) Port on which the database is listening.
- **HOST**: Address of the host where the database is located.
- **USER**: Username for connecting to the database.
- **PASSWORD**: Password for connecting to the database.
- **NAME**: Name of the database to connect to.
- **CONNECTION_LIMIT**: Maximum number of simultaneous connections allowed to the database.

### 4. **URL_FILES**
Specific paths related to file management and templates. (These paths are within the project's `src` folder.)

- **SAVE_LOGS**: Path where system logs are stored.
- **TEMPLATES_PATH**: Path where the application's templates are located, likely used for emails or other functionalities.
- **EMAIL_LANGUAGES_PATH**: Path to JSON files containing email messages in different languages.
- **REGEX_JSON**: Path to the JSON file containing regular expressions used in the application.
- **ROLES_JSON**: Path to the JSON file defining roles within the system.

### 5. **LOG**
Configuration related to log management within the system.

- **LOG_SERVER**: Indicates whether server-level logging should be enabled.
- **LOG_TRACEABILITY**: Indicates whether traceability should be enabled in logs to track actions or events.
- **LOG_DATABASE**: Indicates whether database-related logs should be recorded.
- **LOG_FILE**: Indicates whether logs should be saved to a file.

### 6. **HTTP_REQUEST**
Configuration related to HTTP requests handled by the application.

- **PAGE_SIZE**: Default page size for pagination of results.
- **PAGE_OFFSET**: Default offset for pagination.
- **REQUEST_WITHOUT_JWT**: List of routes that do not require a JWT token to be accessed.
- **REQUEST_WITHOUT_API_KEY**: List of routes that do not require an API key to be accessed.

### 7. **JWT**
Configuration related to JWT tokens used for authentication and authorization.

- **MAIN_TOKEN**:
  - **EXPIRE**: Expiration time for the main token.
  - **SECRET_KEY**: Secret key used to sign the main token.
  
- **REFRESH_TOKEN**:
  - **EXPIRE**: Expiration time for the refresh token.
  - **SECRET_KEY**: Secret key used to sign the refresh token.
  
- **FORGOT_PASS_TOKEN**:
  - **EXPIRE**: Expiration time for the password reset token.
  - **SECRET_KEY**: Secret key used to sign this token.
  
- **REGISTER_TOKEN**:
  - **EXPIRE**: Expiration time for the user registration token.
  - **SECRET_KEY**: Secret key used to sign this token.

### 8. **FILE_STORAGE**
Configuration related to file storage.

- **GENERAL**:
  - **MAX_FILE_SIZE**: Maximum allowed file size for uploads, measured in megabytes.
  
- **AWS**:
  - **BUCKET_NAME**: Name of the Amazon S3 bucket where files are stored. Currently, the logic only supports AWS storage.
  - **REGION**: AWS region where the bucket is located.
  - **ACCESS_KEY**: Access key for connecting to AWS.
  - **SECRET_ACCESS_KEY**: Secret key for connecting to AWS.
  - **MINUTES_LIMIT_PRIVATE_FILE**: Time limit in minutes for accessing private files.
  - **PUBLIC_FOLDER**: Public folder within the bucket for storing publicly accessible files.

### 9. **EMAIL**
Configuration related to the email service used by the application.

- **SERVICE**: Email service used, e.g., "gmail" | "outlook" | "sendgrid".
- **AUTH_USER**: Username or email address used to authenticate with the email service.
- **AUTH_PASSWORD**: Password used to authenticate with the email service.
- **EMAIL_FROM**: Email address from which emails will be sent.

<br><br>

## PROJECT ARCHITECTURE

The architecture of **Tenshi** is inspired by clean and modular architecture principles. It uses generic files that manage the core logic of the application.

### GenericRepository

The `GenericRepository` class serves as the foundational layer, responsible for handling the persistence of data. It provides direct access to TypeScript ORM methods and entities, ensuring the necessary changes are made to the data layer.

- **Constructor**: Requires an `EntityTarget` from the ORM, specifying the table to which the persistence changes will be applied.
- **Implements**: The `IGenericRepository` interface.

### GenericController

The `GenericController` class is a generic controller responsible for handling the necessary validations before processing requests. It performs several key functions:

- **Role Validation**: Ensures the user has the required role to perform the action.
- **Field Validation**: Checks for required fields in both the request body and URL parameters.
- **Regex Validation**: Validates fields using regular expressions.
- **Response Handling**: Sends appropriate responses, whether they be error messages, validation feedback, or success confirmations.

- **Constructor**: Requires an `EntityTarget` to select the specific persistence entity. Optionally, a custom repository class can be passed if specific modifications are needed in the module.
- **Implements**: The `IGenericController` interface.

### GenericRouter

**Tenshi** manages the primary `index.ts` file, where all initialization classes and routes are set up for proper operation.

- **Routes**: The `GenericRouter` class is where the routes for each module are defined. By default, it includes standard CRUD routes. Users can add additional routes as needed, and versioning can be applied dynamically if required.
- **Constructor**: Requires a `GenericController` and optionally a custom route name.


<br><br>

## Database Management
Tenshi utilizes TypeORM for database creation and management using a code-first approach, supporting databases like MariaDB, MySQL, SQL Server, Postgres, and SQLite. By default, Tenshi includes a logs table to store backend error logs, request logs, database logs, and critical application tracking information.

<br><br>

## Response Structure

Tenshi provides a response structure for each of its responses, which is as follows:

- **status**: Provides information about the response of the request.
  - **id**: An identifier for the status value.
  - **message**: A message indicating the status, such as error, not found, success, etc.
  - **http_code**: The HTTP request code of the response.
  
- **data**: Contains the information of the data, such as the information that was just updated, inserted, or the data needed from the GET requests in the application.

- **info**: Provides a message with additional information required to understand what happened with the request.

Example Response:
```json
{
    "status": {
        "id": 1,
        "message": "Success",
        "http_code": 200
    },
    "data": [
        []
    ],
    "info": "Get Entries Successful"
}
```

<br><br>

## Dependencies
| Dependency               | Version      |
|--------------------------|--------------|
| @types/axios             | ^0.14.0      |
| @types/cors              | ^2.8.17      |
| @types/express           | ^4.17.21     |
| @types/jsonwebtoken      | ^9.0.6       |
| @types/mssql             | ^8.1.1       |
| @types/multer            | ^1.4.11      |
| @types/nodemailer        | ^6.4.15      |
| @types/pg                | ^8.6.6       |
| aws-sdk                  | ^2.1672.0    |
| copyfiles                | ^2.4.1       |
| cors                     | ^2.8.5       |
| express                  | ^4.19.2      |
| helmet                   | ^7.1.0       |
| jsonwebtoken             | ^9.0.2       |
| mariadb                  | ^3.3.1       |
| module-alias             | ^2.2.3       |
| mssql                    | ^10.0.1      |
| multer                   | ^1.4.5-lts.1 |
| mysql                    | ^2.18.1      |
| nodemailer               | ^6.9.14      |
| pg                       | ^8.12.0      |
| rate-limiter-flexible    | ^5.0.3       |
| ts-node                  | ^10.9.2      |
| ts-node-dev              | ^2.0.0       |
| tsconfig-paths           | ^4.2.0       |
| typeorm                  | ^0.3.20      |
| typescript               | ^5.5.4       |

<br><br>

## Contribution

As time goes on, Tenshi will continue updating its list of modules that may be useful to those using it. If anyone wishes to contribute to the open-source code, the doors of Tenshi are wide open—whether it's for new developments or improving the current state of the project.

### What is Needed for Tenshi

- Migrate all logic of Tenshi to a TypeScript library.
- Implement logic for adding documents to other services such as Azure and/or local servers.
- Develop OAuth implementation for Google.
- Add a payments methods module.
- Add a subscriptions module.
- Separate validation and error handling logic into middlewares.
