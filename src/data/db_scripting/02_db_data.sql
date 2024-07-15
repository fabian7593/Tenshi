INSERT INTO screens (code, name, description)
VALUES 
    ('CREATE_NEW_PROJECT', 'Create New Project', 'Screen for creating a new project.'),
    ('PRODUCTS', 'Products', 'Screen for managing products.');


INSERT INTO roles (code, name, description)
VALUES 
    ('ADMIN', 'Admin', 'Administrator role with full access to all functionalities.'),
    ('ANALYST', 'Analyst', 'Analyst role with access to analytical tools and reporting functionalities.'),
    ('CUSTOMER', 'Customer', 'Customer role with access to customer-specific functionalities.');


INSERT INTO role_screen (role_code, screen_code, description) VALUES 
('ADMIN', 'CREATE_NEW_PROJECT', 'Screen for creating a new project.'),
('ADMIN', 'PRODUCTS', 'Screen for managing products.');

INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'C', 'CREATE_NEW_PROJECT_CREATE', 'CREATE_NEW_PROJECT', 'Create new project'),
('ADMIN', 'R', 'CREATE_NEW_PROJECT_READ', 'CREATE_NEW_PROJECT', 'Read new project'),
('ADMIN', 'U', 'CREATE_NEW_PROJECT_UPDATE', 'CREATE_NEW_PROJECT', 'Update new project'),
('ADMIN', 'D', 'CREATE_NEW_PROJECT_DELETE', 'CREATE_NEW_PROJECT', 'Delete new project');

INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'R', 'USER_LOGIN', null, null),
('ADMIN', 'R', 'USER_GET_BY_ID', null, null),
('ADMIN', 'C', 'USERS_CREATE', null, 'Create user'),
('ADMIN', 'R', 'USERS_READ', null, 'Read user'),
('ADMIN', 'U', 'USERS_UPDATE', null, 'Update user'),
('ADMIN', 'D', 'USERS_DELETE', null, 'Delete user'),
('ADMIN', 'C', 'UDC_CREATE', null, null),
('ADMIN', 'U', 'UDC_UPDATE', null, null),
('ADMIN', 'D', 'UDC_DELETE', null, null),
('ADMIN', 'R', 'UDC_READ', null, null), -- works for everything
('ADMIN', 'R', 'UDC_GET_BY_ID', null, null),-- WORKS FOR EVERYTHING
('ADMIN', 'R', 'UDC_GET_BY_CODE', null, null); -- WORKS FOR EVERYTHING


INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'R', 'DOCUMENT_GET_BY_NAME',  null, null),
('ADMIN', 'C', 'DOCUMENT_CREATE',  null, null),
('ADMIN', 'U', 'DOCUMENT_UPDATE',  null, null),
('ADMIN', 'D', 'DOCUMENT_DELETE',  null, null),
('ADMIN', 'R', 'DOCUMENT_READ', null, null);


INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'C', 'EMAIL_SEND_BY_USER',  null, null),
('ADMIN', 'C', 'EMAIL_SEND_BY_ALL_USERS',  null, null);



INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'R', 'NOTIFICATION_GET_BY_ID',  null, null),
('ADMIN', 'C', 'NOTIFICATION_CREATE',  null, null),
('ADMIN', 'U', 'NOTIFICATION_UPDATE',  null, null),
('ADMIN', 'D', 'NOTIFICATION_DELETE',  null, null),
('ADMIN', 'R', 'NOTIFICATION_READ', null, null);


INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'C', 'USER_NOTIFICATION_CREATE',  null, null);

INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'R', 'LOG_GET_BY_ID',  null, null),
('ADMIN', 'C', 'LOG_CREATE',  null, null),
('ADMIN', 'U', 'LOG_UPDATE',  null, null),
('ADMIN', 'D', 'LOG_DELETE',  null, null),
('ADMIN', 'R', 'LOG_READ', null, null);






