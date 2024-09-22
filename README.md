[![alt tag](https://raw.githubusercontent.com/fabian7593/Tenshi/main/00_external_information/imgs/tenshi_background.png)]([https://github.com/fabian7593/Tenshi](https://github.com/fabian7593/Tenshi/tree/main))
# Tenshi JS

Tenshi is a modular and scalable backend REST API framework developed in Node.js with TypeScript and Express.js. It is **completely open-source** and designed to facilitate the development of robust applications through a clean and modular architecture.

Tenshi focuses on providing a structured environment to manage security at endpoints, handle errors, log activities, validate requests, and speed up development. It offers flexible, easy-to-use, and dynamic control over various modules that users can add or customize. The framework comes with built-in modules for common tasks, including Users, Roles, Logs, Emails, Notifications, Unit Dynamic Central, and Document Management, making it easier to extend and adapt to specific needs.

With Tenshi, developers benefit from a well-organized structure that enhances productivity and application reliability while allowing for a high degree of modularity and customization.

<br><br>

## Navigation Menu

- [Key Features](#key-features-of-tenshijs)
  - [General](#general)
  - [Security](#security)
  - [Validations](#validations)
  - [Document Management](#document-management)
  - [Modules](#modules)
- [Installation](#installation)
- [Versioning](#versioning)
- [Start Backend Server](#start-backend-server)
- [Configuration](#configuration)
  - [COMPANY](#company)
  - [SERVER](#server)
  - [DB](#db)
  - [URL_FILES](#url_files)
  - [LOG](#log)
  - [HTTP_REQUEST](#http_request)
  - [JWT](#jwt)
  - [FILE_STORAGE](#file_storage)
  - [EMAIL](#email)
- [Import Postman](#import-postman)
- [Project Architecture](#project-architecture)
  - [GenericRepository](#genericrepository)
  - [GenericController](#genericcontroller)
  - [GenericRouter](#genericrouter)
- [RequestHandler Builder Logic](#requesthandler-builder-logic)
- [Application Flow Diagram](#application-flow-diagram)
- [Database Management](#database-management)
- [Response Structure](#response-structure)
- [Managing Roles](#managing-roles)
  - [How to Create and Modify Roles](#how-to-create-and-modify-roles)
- [Managing Regex Patterns](#managing-regex-patterns)
- [Customizing and Adding Email Templates](#customizing-and-adding-email-templates)
- [Dependencies](#dependencies)
- [Contribution](#contribution)
  - [TODO List for Tenshi](#todo-list-for-tenshi)
- [License](#license)

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

# Versioning 
   ```bash
Tenshi Framework - Version 1.0.9
   ```
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

<br><br>

## Start Backend Server
1. Scripts to start the server:
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

## Import Postman:
You need to import your [Postman collection for Tenshi](https://github.com/fabian7593/Tenshi/raw/main/00_external_information/Tenshi.postman_collection.json) to gain access to all the endpoints provided by the Tenshi modules.


<br><br>

## Project Architecture

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

## RequestHandler Builder Logic

The `RequestHandler` class is designed to handle HTTP requests within a web application, streamlining the configuration of various operations needed to process an incoming request. Each `set` method configures a specific aspect of request processing, making validation, transformation, and execution of operations orderly and predictable. The constructor accepts two parameters: `res` and `req`, representing the HTTP response and request, respectively.

Each `set` method in this class allows for the configuration of a specific aspect of request handling. These methods follow the "Builder" pattern, enabling fluent chaining of configurations and returning the instance of the class for continued use.

- #### `setRequiredFiles(requiredFieldsList: Array<string>)`

This method configures a list of required fields in the body of the request, ensuring that all necessary fields are present before processing. This is primarily used in POST and PUT methods.

- #### `setFilters(filters: FindManyOptions)`

This method sets up the filters to be applied when performing a database query for multiple records using TypeORM. These filters help to limit or specify the data returned in the response. It is primarily utilized in GET requests that require filtering.

- #### `setMethod(method: string)`

This method specifies the name of the method or operation being executed. This name is crucial for logging the operation in the application logs, aiding in tracking and auditing actions performed. It is also used for identification purposes, especially when generic classes are employed. This is used across all HTTP requests.

- #### `setAdapter(adapter: IAdapterFromBody)`

This method assigns an adapter responsible for transforming the request body data into a specific format that the entity can utilize. This adapter is crucial when the received data needs to be processed or structured before being used in business operations. A new DTO specific to the module is created here. This is primarily used in POST and PUT methods.

- #### `setRegexValidation(regexValidatorList: [string, string][])`

This method sets up a list of validations using regular expressions. Each entry in the list contains a field and a corresponding regular expression that will be used to validate the content of that field. This is useful for ensuring that the data conforms to certain formats or restrictions before processing. It is primarily used in POST and PUT methods.

- #### `isValidateRole(module: string)`

This method enables role validation for the current request. If enabled, the system will verify whether the user has the appropriate role to perform the requested operation. The required parameter is the module setting from `roles.json`. This is used in all HTTP requests that require role validation.

- #### `isLogicalDelete()`

This method flags the request to perform a logical delete instead of a physical delete. This means that the record will not be removed from the database but will be marked as deleted (e.g., setting an `isDeleted` field to `true`). This is used in almost all HTTP requests. For GET requests, this method considers whether a record is logically deleted (e.g., if `is_deleted = true`, the record will not be shown in the GET response).

- #### `isValidateWhereByUserId()`

This method enables the validation of WHERE conditions in a query, ensuring that the necessary validations by `UserId` are included. This is useful in situations where data needs to be specifically filtered for the user making the request.

<br><br>

### Application Flow Diagram

                                               HTTP Request
                                                   │
                                                   ▼
                                           ┌─────────────────┐
                                           │   Router Class  │
                                           │  (set Handler)  │
                                           └─────────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────────┐
                                           │  Handler Class  │
                                           └─────────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────────┐
                                           │ Controller Class│
                                           └─────────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────────┐
                                           │  Repository Class│
                                           └─────────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────────┐
                                           │     Entity      │
                                           └─────────────────┘



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

## Managing Roles

### How to Create and Modify Roles

Roles are defined in the `src/data/json/roles.json` file. The structure of the JSON file is designed to manage user roles and their associated permissions effectively. Here’s a breakdown of the role structure:

```json
{
  "roles": [
    {
      "id": 1,
      "code": "ADMIN",
      "name": "Administrator",
      "description": "Administrator role with full access to all functionalities.",
      "modules": [
        {
          "name": "DOCUMENT",
          "function_list": [
            "CREATE",
            "GET_BY_ID",
            "GET_ALL"
          ]
        },
        {
          "name": "USER",
          "function_list": [
            "CREATE",
            "UPDATE",
            "DELETE",
            "GET_BY_ID",
            "GET_ALL"
          ]
        }
      ],
      "screens": [
        {
          "name": "CREATE_NEW_PROJECT"
        },
        {
          "name": "PRODUCTS"
        }
      ]
    }
  ]
}
```

### Structure Breakdown

- **id**: A unique identifier for the role.
- **code**: A short code representing the role.
- **name**: The display name of the role.
- **description**: A brief description of the role’s permissions and capabilities.
- **modules**: An array of modules associated with the role, where each module has:
  - **name**: The name of the module.
  - **function_list**: A list of functions or actions that can be performed within this module (e.g., CREATE, UPDATE, DELETE).
- **screens**: An array of screens or views that are accessible by the role, where each screen has:
  - **name**: The name of the screen.

### Adding or Modifying Roles

To add a new role or modify an existing one:

1. **Edit the JSON file**: Add or update role objects in the `roles` array.
2. **Define new modules and screens**: Ensure that any new modules or screens are properly defined and associated with the appropriate functions.
3. **Save changes**: Ensure that the JSON structure remains valid and that all roles are correctly represented.


<br><br>



## Managing Regex Patterns

To add additional regular expressions (regex) to the `regex.json` file, follow these steps:

1. **Open the `regex.json` File**: Locate the `regex.json` file in your project directory at `src/data/json/regex.json`.

2. **Define the New Regex Pattern**:
    - **Key**: Assign a unique key to identify the new regex pattern. This key will be used to reference the pattern in your application.
    - **message**: Provide a descriptive message that will be shown when the regex validation fails. This message should clearly explain the validation error to the user.
    - **regex**: Write the regular expression pattern that you want to apply. Make sure the pattern is valid and correctly captures the intended validation criteria.

3. **Add the New Pattern to the JSON Structure**:
    - Insert a new object into the JSON structure following the format of the existing patterns. Each object should include the `message` and `regex` fields.

4. **Save and Validate**: After adding the new pattern, save the `regex.json` file. Ensure the JSON structure remains valid and that the new pattern is correctly integrated.

### Example of Adding a New Regex Pattern

Here's how to add a new regex pattern to validate phone numbers:

```json
{
    "PHONE_REGEX": {
        "message": "Incorrect Phone Number Format",
        "regex": "^\\+?[1-9]\\d{1,14}$"
    }
}
```
<br><br>

## Customizing and Adding Email Templates

To customize existing email templates or add new ones, follow these guidelines:

1. **Locate Existing Templates**:
   - Find the current email templates in the `src/templates` directory.
   - You can modify the HTML and CSS structure of these templates to fit your needs.

2. **Use Replacement Tags**:
   - Templates include various replacement tags, such as `{{ mainColor }}`, `{{ backgroundColor }}`, and `{{ companyName }}`, which pull values from the configuration file.
   - Texts in the templates are dynamically replaced based on the user's language preferences. Common placeholders include `{{ nameTemplateTitle }}` and `{{ generalHello }}`.

3. **Manage Language Files**:
   - Language-specific texts are managed in `src/data/json/emailMessages`.
   - By default, you will find `emailMessages.en.json` and `emailMessages.es.json`. You can add additional language files as needed.
   - In these JSON files, include text entries using the template name followed by `Message`, such as:
     ```json
     "registerEmailSubject": "Account Verification",
     "registerEmailTitle": "Welcome to {{ companyName }}",
     ```

4. **Create and Use New Templates**:
   - You can create new templates as required, following the same rules for language and replacement tags.
   - Send emails using these templates as needed in your code.


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

### Todo List For Tenshi

- **Library:** Migrate all logic of Tenshi to a TypeScript library.
- **Factory Pattern Documents:** Implement logic for adding documents to other services such as Azure and/or local servers.
- **Oauth:** Develop OAuth implementation for Google.
- **Endpoint:** Implement Logout
- **Endpoint:** Get all roles (just for admin)
- **Module:** Add a payments methods.
- **Module:** Add a subscriptions.
- **Generics:** Create Generics methods for GenericRouters class (Just send the handle request by prameter).
- **Middleware:** Separate validation and error handling logic into middlewares.
- **Testing:** Create testing environment, for Unit Test all endpoints.
- **DevOps:** Create Devops Docker File and publish.
- **Documentation:** Create Postman Endpoints Documentation.
- **Videos:** Create some explanation video tutorials for explain how to use tenshi version 1.0.9


<br><br><br>

# License
Copyright 2024 Arcane Coder

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
<br><br>
