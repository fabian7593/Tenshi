# Tenshi 

## Overview
Tenshi is a modular and scalable backend REST API framework developed in Node.js with TypeScript and Express.js. It is **completely open-source** and designed to facilitate the development of robust applications through a clean and modular architecture. Tenshi focuses on providing a structured environment to manage users, permissions, roles (via JSON format), documents, logs, emails, notifications, and other essential modules for backend development.

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
