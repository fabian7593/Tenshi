[![alt tag](https://raw.githubusercontent.com/fabian7593/Tenshi/main/00_external_information/imgs/tenshi_background.png)]([https://github.com/fabian7593/Tenshi](https://github.com/fabian7593/Tenshi/tree/main))
# Tenshi Backend TS

Tenshi is a modular and scalable backend REST API framework developed in Node.js with TypeScript and Express.js. It is **completely open-source** and designed to facilitate the development of robust applications through a clean and modular architecture.

Tenshi focuses on providing a structured environment to manage security at endpoints, handle errors, log activities, validate requests, and speed up development. It offers flexible, easy-to-use, and dynamic control over various modules that users can add or customize. The framework comes with built-in modules for common tasks, including Users, Roles, Logs, Emails, Notifications, Unit Dynamic Central, and Document Management, making it easier to extend and adapt to specific needs.

With Tenshi, developers benefit from a well-organized structure that enhances productivity and application reliability while allowing for a high degree of modularity and customization.

<br><br>

---

## Navigation Menu

- [Key Features](#key-features-of-tenshits)  
  - [General](#general)  
  - [Security](#security)  
  - [Validations](#validations)  
  - [Document Management](#document-management)  
  - [Modules](#modules)  
- [Versioning](#versioning)  
- [Installation](#installation)  
- [Start Backend Server](#start-backend-server)  
  - [Scripts](#scripts)  
- [Build & Run in Production](#build--run-in-production)  
  - [Set up module aliases for production](#set-up-module-aliases-for-production)  
  - [Build the project](#build-the-project)  
  - [Install PM2 globally (Linux)](#install-pm2-globally-linux)  
  - [Start the production build using PM2](#start-the-production-build-using-pm2)  
- [Docker Deployment](#docker-deployment)  
  - [Dockerfile](#dockerfile)  
  - [Linux – Build and Run](#linux--build-and-run)  
  - [Stop and Remove Container](#stop-and-remove-container)  
  - [One-Line Deployment (Linux only)](#one-line-deployment-linux-only)  
- [Useful PM2 Commands](#useful-pm2-commands)  
- [Configuration](#configuration)  
  - [COMPANY](#1-company)  
  - [SERVER](#2-server)  
  - [SUPER_ADMIN](#3-super_admin)  
  - [DB](#4-db)  
  - [URL_FILES](#5-url_files)  
  - [LOG](#6-log)  
  - [HTTP_REQUEST](#7-http_request)  
  - [JWT](#8-jwt)  
  - [FILE_STORAGE](#9-file_storage)  
  - [EMAIL](#10-email)  
  - [TEST](#11-test)  
- [Import Postman](#import-postman)  
  - [Import the Collection](#1-import-the-collection)  
  - [Configure Environment Variables](#2-configure-environment-variables)  
  - [Authentication Flow](#3-authentication-flow)  
  - [Suggested Usage Flow for Frontend Integration](#suggested-usage-flow-for-frontend-integration)  
    - [Auth Module](#auth-module)  
    - [Users Module](#users-module)  
    - [UDC Module](#udc-module-unit-dynamic-central)  
    - [Documents Module](#documents-module)  
    - [Email Module](#email-module)  
    - [Logs Module](#logs-module)  
    - [Roles Module](#roles-module)  
- [Project Architecture](#project-architecture)  
  - [GenericRepository](#genericrepository)  
  - [GenericController](#genericcontroller)  
  - [GenericRouter](#genericrouter)  
- [RequestHandler Builder Logic](#requesthandler-builder-logic)  
- [Application Flow Diagram](#application-flow-diagram)  
- [Database Management](#database-management)  
- [Insert Seeds](#insert-seeds)  
- [Testing](#testing)  
- [Automation](#automation)  
- [Response Structure](#response-structure)  
- [Managing Roles](#managing-roles)  
  - [How Roles Work](#how-roles-work)  
  - [Role Structure Explained](#role-structure-explained)  
  - [User ID Validation Logic](#user-id-validation-logic)  
  - [Quick Summary](#quick-summary)  
- [Managing Regex Patterns](#managing-regex-patterns)  
- [Customizing and Adding Email Templates](#customizing-and-adding-email-templates)  
- [Dependencies](#dependencies)  
- [Contribution](#contribution)  
  - [TODO List for Tenshi](#todo-list-for-tenshi)  
- [License](#license)

<br><br>


## Key Features of TenshiTS

### General
- Rapid development of robust backend REST APIs with essential security validations.
- Generic classes for controllers and repositories, easily adaptable to any entity.
- Modular architecture, enabling the use of only necessary modules and the creation of microservices.
- Comprehensive error handling, logging, and traceability.
- Role management through a JSON file.
- Email module supporting individual or bulk email sending.
- Multi-language support for emails and notifications.
- Correctly management of CORS.

### Security
- Password encryption and protection of critical data with BCrypt.
- Privacy management for specific files in file storage module (document module).
- JWT management with expiration limits.
- API key validation.
- Request throttling to prevent DDoS attacks.
- Security headers via Helmet.
- JWT storage in memory cache (node-cache library) for logout implementation.

### Validations
- JWT validation.
- API key validation.
- Regex validation.
- Required fields validation.
- Query parameters validation.
- DTOs for body validation and response data.
- Role and user permissions validation for executing requests.
- Route not found middleware validation.

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
Tenshi Framework - Version 1.0.13
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

This project provides a set of NPM scripts to compile, seed, test, and run the backend in different environments.

### Scripts

```bash
# Start server in development mode with live reload
npm run dev

# Start server in production mode (compiles and runs TypeScript source directly)
npm run start

# Compile TypeScript project (outputs to /build directory)
npm run compile

# Run full build process: compile + copy config/templates + static JSON files
npm run build

# Run compiled production build (from /build directory)
npm run prod

# Run Jest test suite
npm run test

# Execute script for create basic CRUD from entity
npm run automation

# Execute script for create basic test from entity
npm run autotest

# Seed the database with initial data (in this example just UDC)
npm run generalseed

# Delete all data from the database (to start again from 0)
npm run delete

# Copy JSON config file to /build directory
npm run copyjsonconfig

# Copy JSON files from /src/data/json to /build/src
npm run copyjsonsrc

# Copy JSON files from /tenshi/data/json to /build/tenshi
npm run copyjsontenshi

# Copy HTML templates from /src/templates to /build
npm run copytemp
```

---



## Build & Run in Production

To prepare and run the backend server in a production environment using PM2:

### Set up module aliases for production

Before building the project, make sure the correct `_moduleAliases` are in place. These aliases should point to the compiled `/build` directory and are defined in the `package.prod.json` file at the root of the project.

```json
"_moduleAliases": {
  "tenshi": "build/tenshi",
  "@TenshiJS": "build/tenshi",
  "@index": "build/src",
  "@modules": "build/src/modules",
  "@templates": "build/templates",
  "@entity": "build/src/entity",
  "@data": "build/data/json",
  "@utils": "build/src/utils"
}
```

You can either:
- Manually copy the content of `package.prod.json` into your `package.json`, or
- Rename the file before building:

```bash
mv package.prod.json package.json
```

This step ensures your import paths resolve correctly when running the compiled code.

### Build the project

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Copy all necessary JSON files and templates to the `/build` directory

### Install PM2 globally (Linux)

```bash
npm install -g pm2
```

### Start the production build using PM2

```bash
pm2 start npm --name "tenshibackend" -- run prod
```

This command:
- Starts the compiled backend located in `/build/src/index.js`
- Names the process `tenshibackend` for easier management


If you need to run withouth build or compile, just use, this run directly from typescript 
(In this case you need to delete the module Aliases from package.json):
```bash
pm2 start npm --name "tenshibackend" -- run start
```

---

## Docker Deployment

You can also deploy the backend using Docker, which encapsulates all dependencies and ensures environment consistency.

### Dockerfile

### Linux – Build and Run

1. Make sure Docker is installed and running:

```bash
docker --version
```

2. Rename `package.prod.json` or copy the content to:

```bash
mv package.prod.json package.json
```

3. Build the image:

```bash
docker build -t tenshi-backend .
```

4. Run the container:

```bash
docker run -d -p 3000:3000 --name tenshi-backend tenshi-backend
```

This maps your container's port 3000 to your local port 3000. Adjust as needed.

### Stop and Remove Container

```bash
docker stop tenshi-backend
docker rm tenshi-backend
```

### One-Line Deployment (Linux only)

If you're using Linux, you can run the entire Docker build and deployment process with one command:

```bash
chmod +x deploy-prod.sh
./deploy-prod.sh
```


##  Useful PM2 Commands

```bash
# Show status of all processes
pm2 list

# Restart the backend process
pm2 restart tenshibackend

# Stop the backend process
pm2 stop tenshibackend

# View logs
pm2 logs tenshibackend

# Delete the process to the list
pm2 delete tenshibackend

# Launch PM2 on system startup
pm2 startup
```

---


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
- **MAX_REQUEST_PER_SECOND**: Maximum number of requests allowed per second, used to prevent denial of service (DoS) attacks.
- **IS_DEBUGGING**: (bool) Indicates if the server is in debugging mode, which typically provides more detailed error information and logs.
- **FAIL_LOGIN_MAX_NUMBER**: Maximum number of failed login attempts before blocking or taking action.
- **DEFAULT_LANGUAGE**: (2 letters language) Default language of the server.
- **FORMAT_DATE**: Date format used for localization, e.g., "es-ES" for Spanish (Spain).
- **CUSTOMER_REGULAR_ROLE**: Set the code  of the role when a regular user register, this will be used on register endpoint.

### 3. **SUPER_ADMIN**
Configuration of the first master user. This user is inserted in the first time open server.

- **USER_EMAIL**: The email address associated with the super admin account. This is typically used for authentication and communication.
- **PASSWORD**: The password for the super admin account. This is required for logging into the system and should be kept secure.
- **FIRST_NAME**: The first name of the super admin user. 
- **LAST_NAME**: The last name of the super admin user. 
- **USERNAME**: A unique identifier for the super admin account. This is used for logging in.
- **ROLE_CODE**: This is the role code for super admin, you could wait it on src/data/json/roles.json

### 4. **DB**
Configuration related to the database.

- **TYPE**: Type of database being used. Options include "mysql" | "mariadb" | "postgres" | "mssql".
- **PORT**: (number) Port on which the database is listening.
- **HOST**: Address of the host where the database is located.
- **USER**: Username for connecting to the database.
- **PASSWORD**: Password for connecting to the database.
- **NAME**: Name of the database to connect to.
- **CONNECTION_LIMIT**: Maximum number of simultaneous connections allowed to the database.

### 5. **URL_FILES**
Specific paths related to file management and templates. (These paths are within the project's `src` folder.)

- **SAVE_LOGS**: Path where system logs are stored.
- **TEMPLATES_PATH**: Path where the application's templates are located, likely used for emails or other functionalities.
- **EMAIL_LANGUAGES_PATH**: Path to JSON files containing email messages in different languages.
- **REGEX_JSON**: Path to the JSON file containing regular expressions used in the application.
- **ROLES_JSON**: Path to the JSON file defining roles within the system.

### 6. **LOG**
Configuration related to log management within the system.

- **LOG_SERVER**: Indicates whether server-level logging should be enabled.
- **LOG_TRACEABILITY**: Indicates whether traceability should be enabled in logs to track actions or events.
- **LOG_DATABASE**: Indicates whether database-related logs should be recorded.
- **LOG_FILE**: Indicates whether logs should be saved to a file.
- **LOG_MIDDLEWARE**: Indicates whether middleware logging should be enabled. **We recommended use it just for development.**

### 7. **HTTP_REQUEST**
Configuration related to HTTP requests handled by the application.

- **PAGE_SIZE**: Default page size for pagination of results.
- **PAGE_OFFSET**: Default offset for pagination.
- **REQUEST_WITHOUT_JWT**: List of routes that do not require a JWT token to be accessed.
- **REQUEST_WITHOUT_API_KEY**: List of routes that do not require an API key to be accessed.

### 8. **JWT**
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

### 9. **FILE_STORAGE**
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

### 10. **EMAIL**
Configuration related to the email service used by the application.

- **SERVICE**: Email service used, e.g., "gmail" | "outlook" | "sendgrid".
- **AUTH_USER**: Username or email address used to authenticate with the email service.
- **AUTH_PASSWORD**: Password used to authenticate with the email service.
- **EMAIL_FROM**: Email address from which emails will be sent.

### 11. **TEST**
Configuration related to run npm run test.

- **JWT_TEST**: This is the JWT of the user that have permission to have another role.
- **ROLE_TEST**: This is the name of he role that you validate, could be any role.

<br><br>

---

## Import Postman

To test and explore the available endpoints in Tenshi, you can use the official [Tenshi Postman Collection](https://github.com/fabian7593/Tenshi/raw/main/00_external_information/Tenshi.postman_collection.json).

### 1. Import the Collection

- Download and open the `.postman_collection.json` file.
- In Postman, go to **File → Import**, then choose the file or paste the URL above.
- The collection is organized by modules (Auth, Users, Documents, UDCs, Logs, etc.), reflecting the backend's modular architecture.

### 2. Configure Environment Variables

Before using the endpoints, configure a Postman Environment with the following variables:

| Variable         | Description                                |
|------------------|--------------------------------------------|
| `host`           | Backend base URL (e.g., `http://localhost:3000`) or anyonw published|
| `auth_jwt`       | JWT token obtained after logging in        |
| `secret_api_key` | API key defined in your `tenshi-config.json` |

> By default, both JWT and API Key are required for most protected endpoints.  
> You can modify access in the configuration:
>
> - Use `HTTP_REQUEST.REQUEST_WITHOUT_JWT` to exclude routes from requiring JWT.
> - Use `SERVER.VALIDATE_API_KEY: false` to disable API key validation completely.

---

### 3. Authentication Flow

1. Use the `/auth/login` endpoint to authenticate a user (e.g., Super Admin, Admin or Regular).
2. Copy the `access_token` from the response and assign it to `auth_jwt` in your Postman environment.
3. Use this token in your `authorization` header for authenticated requests.
4. Ensure `secret_api_key` is set for API requests that require it.

---

### Suggested Usage Flow for Frontend Integration

Here’s a modular breakdown of how to explore Tenshi’s API and how access is controlled by roles:

---

#### Auth Module

Manages login, registration, token refresh, logout, and password recovery.

**Endpoints:**

- `POST /auth/register`: Allows registering a user with a public role (e.g., CUSTOMER).
- `POST /auth/login`: Authenticate and get a JWT.
- `POST /auth/logout`: Ends user session.
- `POST /forgot_password` and `POST /reset_password`: Password recovery flow.
- `GET /confirmation_register`: Confirms email verification.

**Role Access:**

- Only roles with `"is_public": true` can be registered through `/auth/register`.
- All users (public or authenticated) can use password recovery and login.
- Admins can assign private roles during `/user/add` but public roles are self-assignable.

---

#### Users Module

Manages full CRUD operations on users.

**Endpoints:**

- `POST /user/add`: Create a new user (with any role).
- `GET /user/get`, `GET /user/get_all`: Fetch users or user details.
- `PUT /user/edit`: Update user data.
- `DELETE /user/delete`: Soft-delete a user.

**Role Access:**

- **Admin**: Has full access to all user-related functions: CREATE, UPDATE, DELETE, GET_ALL, GET_BY_ID.
- **Non-admin roles**:
  - Cannot create new users.
  - Cannot access `GET_ALL` or `DELETE` unless explicitly permitted.

> Note: Role logic is defined in `roles.json`. If a role lacks `"CREATE"` under the `USER` module, `/user/add` will be forbidden even if the token is valid.

---

#### UDC Module (Unit Dynamic Central)

Stores reusable codes used throughout the application (like enums, categories, settings).

**Endpoints:**

- `POST /udc/add`, `PUT /udc/edit`, `DELETE /udc/delete`: Manage dynamic values.
- `GET /udc/get_all`, `GET /udc/get_by_code`: Retrieve UDCs for filters or dropdowns.

**Role Access:**

- Only roles with `"CREATE"`, `"UPDATE"`, or `"DELETE"` under the `UDC` module (if defined) can modify UDCs.
- `GET_ALL` and `GET_BY_CODE` can be made accessible to any authenticated role, depending on `roles.json`.

**Frontend Tip:**  
Use this to dynamically populate dropdowns such as "Event Types", "Camp Categories", etc., from the backend. This allows content administrators to manage options without code changes.

---

#### Documents Module

Handles file management for all modules (user profile pictures, attachments, uploads).

**Endpoints:**

- `POST /document/add`: Upload document using form-data.
- `GET /document/get_all`, `GET /document/get_by_code`, `GET /document/get_by_filters`: List or retrieve documents.
- `PUT /document/edit`, `DELETE /document/delete`: Update or remove documents.

**Role Access:**

- Admins: Full access to upload, modify, and delete documents.
- `is_public: true` documents can be accessed even without login if configured.

**Frontend Tip:**  
When uploading a file, include metadata like `table`, `id_for_table`, and `action_type`. This allows linking the document to any specific entity like a USER or PROJECT.

---

#### Email Module

Sends templated emails to users.

**Endpoints:**

- `POST /email/send_email`: Send to specific user.
- `POST /email/send_email_all_users`: Send broadcast email.

**Role Access:**

- Restricted to roles with `"SEND_EMAIL"` or equivalent custom permission in `roles.json`.
- Typically reserved for Admins or internal roles with mass-communication responsibilities.

**Frontend Tip:**  
Useful for triggering onboarding, confirmation, or campaign emails directly from your interface (e.g., admin panel actions).

---

#### Logs Module

Allows the frontend or backend to report internal or external events/errors.

**Endpoints:**

- `POST /log/add`: Send error/debug logs from the client or frontend.
- `GET /log/get_all`: Retrieve logs.

**Role Access:**

- All authenticated users can send logs.
- Only Admins can retrieve them unless another role has the `LOG → GET_ALL` permission.

**Frontend Tip:**  
Use this to report frontend-level issues (e.g., file upload errors, token validation failures) to your backend team automatically.

---

#### Roles Module

Returns information about the roles and access levels in the system.

**Endpoint:**

- `GET /role/get_all`

**Role Access:**

- Only Admins or roles with permission under the `ROLE` module can access this.
- Useful for displaying available roles in admin user management screens.

---


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

- #### `setCodeMessageResponse(codeMessage: string)`

This method sets the new code message to provide a dynamic reply for any request. You need to set the code and the message from `src/data/json/messages.json`.

- #### `isRequireIdFromQueryParams(isRequired: boolean)`

This method configures whether the request requires an ID to be passed through query parameters. By default, it is true.

- #### `setDynamicRoleValidationByEntityField(dynamicRoleList: Array<[string, string]>)`

Defines the access rules where a role can access or mutate an entity only if a specific field (or nested field) matches the JWT user ID. Accepts an array of `[role, field]`, such as:

```ts
.setDynamicRoleValidationByEntityField([
  ["CUSTOMER", "user_id"],
  ["MANAGER", "customer.id"]
])
```

This feature allows precise field-level access control per role.

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

## Insert Seeds
This refers to a script to populate a database with initial or default data. Seeding is often necessary for setting up the initial state of an application, especially when working in development, testing, or staging environments.
The seed on tenshi is in src/seed, and you could modify the scripting in package.json.

   ```bash
   //this is for run to insert seeds
   npm run seed
   ```

<br><br>

## Testing
We added a script for testing files, actually we only have the unit test.
But we will added integration test as well. 

**Note: REMEMBER, before the test, you need to start your server and get a JWT from Super admin user, and you need to change the JWT on testing.config file.**

Here:

  ```bash
    "TEST" : {
        "JWT_TEST": "",
        "ROLE_TEST": ""
    }
  ```

  And for run the test, you need to run de script, like this
   ```bash
   //you need to run this script
   npm run test
   ```

<br><br>

## Automation
Tenshi have some features about creation files automatically.
You only need to create an entity into `src/entity`.
And then you need to run the scripts.

**Note: REMEMBER, you need to add the name of the entity after the script name, and verify that this name is equals to the respective entity.**

   ```bash
   //for create DTOs files and routers files into modules, you can do this
   npm run automation NameEntity
   ```

   ```bash
   //for create Postman files for importing, and integration test files of this entity and curent endpoints, you need to do this.
   npm run autotest NameEntity
   ```
When you complete this scripts, you need to verify manually the required fields, and the settings into the builder on router files, that you need.

And then you need to test, with the script testing or from postman.

<br><br>

## Response Structure

Tenshi provides a response structure for each of its responses, which is as follows:

- **status**: Provides information about the response of the request.
  - **id**: An identifier for the status value.
  - **message**: A message indicating the status, such as error, not found, success, etc.
  - **http_code**: The HTTP request code of the response.
  
- **data**: Contains the information of the data, such as the information that was just updated, inserted, or the data needed from the GET requests in the application.

- **info**: Provides a message with additional information required to understand what happened with the request.

Example Response for get multiple entities:
```json
{
    "status": {
        "id": 1,
        "message": "Success",
        "http_code": 200
    },
    "data": [
        {"Test"},
        {"Test 2"}
    ],
    "info": "Get Entries Successful"
}
```


Example Response for get only one entity:
```json
{
    "status": {
        "id": 1,
        "message": "Success",
        "http_code": 200
    },
    "data": {
      "Test"
    },
    "info": "Get Entry Successful"
}
```

<br><br>


## Managing Roles

Tenshi uses a local `roles.json` file (in `src/data/json/roles.json`) instead of storing roles in a database. 
This is intentional and based on the framework’s modular and microservice-oriented philosophy:

- **No dependency on external auth modules.** Each microservice can define and validate its own role-based permissions.
- **Static config for performance.** Roles are loaded on server boot.
- **Restart required.** If you modify `roles.json`, you must restart the backend server for changes to take effect.

### Breakdown of Role Structure 

```json
{
  "roles": [
    {
      "id": 1,
      "code": "ADMIN",
      "name": "Administrator",
      "is_public": true,
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

### Role Structure Explained
- `code`: The internal identifier that is linked to each user (`user.role_code`).
- `is_public`: Defines whether users with this role can be registered via the `/auth/register` endpoint. If `false`, they can only be created by an admin via `/user/add`.
- `modules`: Defines which modules and which functions (`CREATE`, `GET_ALL`, etc.) a role can access.
- `screens`: Optional UI-related metadata for frontend interfaces.


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
| @types/bcrypt            | ^5.0.2       |
| @types/cors              | ^2.8.17      |
| @types/express           | ^4.17.21     |
| @types/jsonwebtoken      | ^9.0.6       |
| @types/mssql             | ^8.1.1       |
| @types/multer            | ^1.4.11      |
| @types/nodemailer        | ^6.4.15      |
| @types/pg                | ^8.6.6       |
| @types/supertest         | ^6.0.2       |  
| aws-sdk                  | ^2.1672.0    |
| bcrypt                   | ^5.1.1       |
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
| node-cache               | ^5.1.2       | 
| nodemailer               | ^6.9.14      |
| pg                       | ^8.12.0      |
| rate-limiter-flexible    | ^5.0.3       |
| supertest                | ^7.0.0       |  
| ts-node                  | ^10.9.2      |
| ts-node-dev              | ^2.0.0       |
| tsconfig-paths           | ^4.2.0       |
| typeorm                  | ^0.3.20      |
| typescript               | ^5.5.4       |
| @types/jest              | ^29.5.13     |  
| jest                     | ^29.7.0      |  
| ts-jest                  | ^29.2.5      |  


<br><br>



## Contribution

As time goes on, Tenshi will continue updating its list of modules that may be useful to those using it. If anyone wishes to contribute to the open-source code, the doors of Tenshi are wide open—whether it's for new developments or improving the current state of the project.

### Todo List For Tenshi

- **Library:** Migrate all logic of Tenshi to a TypeScript library. ***URGENT***
- **Factory Pattern Documents:** Implement logic for adding documents to other services such as Azure and/or local servers.
- **Oauth:** Develop OAuth implementation for Google.
- **Security:** Add Two Factor Authentication logic.
- **Better:** Add logic of create folder by app code and by user id in folder S3 from document module.
- **Better:** Add logic of rollback when 1 execution is wrong, when ypu shot a lot of db executions.
- **Module:** Add payments methods module.
- **Module:** Add subscriptions module.
- **Module:** Add gamification module.
- **Logic:** Add notifications between endpoints, without calla  ntoification request.
- **Videos:** Create some explanation video tutorials for explain how to use tenshi version 1.0.13


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
