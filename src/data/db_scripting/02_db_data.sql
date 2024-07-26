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
('ADMIN', 'R', 'USER_GET_BY_ID', null, null),
('ADMIN', 'C', 'USER_CREATE', null, 'Create user'),
('ADMIN', 'R', 'USER_GET_ALL', null, 'Read user'),
('ADMIN', 'U', 'USER_UPDATE', null, 'Update user'),
('ADMIN', 'D', 'USER_DELETE', null, 'Delete user'),
-- udc
('ADMIN', 'C', 'UNIT_DYNAMIC_CENTRAL_CREATE', null, null),
('ADMIN', 'U', 'UNIT_DYNAMIC_CENTRAL_UPDATE', null, null),
('ADMIN', 'D', 'UNIT_DYNAMIC_CENTRAL_DELETE', null, null),
('ADMIN', 'R', 'UNIT_DYNAMIC_CENTRAL_GET_ALL', null, null), -- works for everything
('ADMIN', 'R', 'UNIT_DYNAMIC_CENTRAL_GET_BY_ID', null, null); -- WORKS FOR EVERYTHING


INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'R', 'DOCUMENT_GET_BY_ID',  null, null),
('ADMIN', 'C', 'DOCUMENT_CREATE',  null, null),
('ADMIN', 'U', 'DOCUMENT_UPDATE',  null, null),
('ADMIN', 'D', 'DOCUMENT_DELETE',  null, null),
('ADMIN', 'R', 'DOCUMENT_GET_ALL', null, null);

INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'C', 'SEND_MAIL',  null, null);


INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'R', 'NOTIFICATION_GET_BY_ID',  null, null),
('ADMIN', 'C', 'NOTIFICATION_CREATE',  null, null),
('ADMIN', 'U', 'NOTIFICATION_UPDATE',  null, null),
('ADMIN', 'D', 'NOTIFICATION_DELETE',  null, null),
('ADMIN', 'R', 'NOTIFICATION_GET_ALL', null, null);


INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'C', 'USER_NOTIFICATION_CREATE',  null, null),
('ADMIN', 'U', 'USER_NOTIFICATION_UPDATE',  null, null),
('ADMIN', 'D', 'USER_NOTIFICATION_DELETE',  null, null),
('ADMIN', 'R', 'USER_NOTIFICATION_GET_BY_ID', null, null);

INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'R', 'LOG_GET_BY_ID',  null, null),
('ADMIN', 'C', 'LOG_CREATE',  null, null),
('ADMIN', 'U', 'LOG_UPDATE',  null, null),
('ADMIN', 'D', 'LOG_DELETE',  null, null),
('ADMIN', 'R', 'LOG_GET_ALL', null, null);






