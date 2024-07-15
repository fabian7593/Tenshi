
# -------------------------------------------------------
#               JUST FOR TESTING

-- Insert records into units_dynamic_central
INSERT INTO `units_dynamic_central` (`code`, `name`, `type`, `value1`)
VALUES
('AUTOMOTIVE', 'Automotive Industry', 'INDUSTRY_TYPE', 'Automotive'),
('TEXTILE', 'Textile Industry', 'INDUSTRY_TYPE', 'Textile'),
('TECHNOLOGY', 'Technology Industry', 'INDUSTRY_TYPE', 'Technology'),
('FOOD_AND_BEVERAGE', 'Food and Beverage Industry', 'INDUSTRY_TYPE', 'Food and Beverage'),
('PHARMACEUTICAL', 'Pharmaceutical Industry', 'INDUSTRY_TYPE', 'Pharmaceutical');


INSERT INTO screens (code, name, description)
VALUES 
    ('MANUFACTURE_SCREEN', 'MANUFACTURES', 'SCREEN FOR CREATE MANUFACTURES');

INSERT INTO role_screen (role_code, screen_code, description) VALUES 
('ADMIN', 'MANUFACTURE_SCREEN', 'Screen for creating MANUFACTURES');


INSERT INTO role_functionallity (role_code, func_type, function_code, screen_code, description) VALUES 
('ADMIN', 'C', 'MANUFACTURE_CREATE', 'MANUFACTURE_SCREEN', 'Create new project'),
('ADMIN', 'R', 'MANUFACTURE_READ', 'MANUFACTURE_SCREEN', 'Read new project'),
('ADMIN', 'U', 'MANUFACTURE_UPDATE', 'MANUFACTURE_SCREEN', 'Update new project'),
('ADMIN', 'D', 'MANUFACTURE_DELETE', 'MANUFACTURE_SCREEN', 'Delete new project');


DROP TABLE IF EXISTS `manufactures`;
CREATE TABLE IF NOT EXISTS `manufactures` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `state` VARCHAR(100) DEFAULT NULL,
    `zip_code` VARCHAR(20) DEFAULT NULL,
    `country_iso_code` VARCHAR(3) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `website` VARCHAR(255) DEFAULT NULL,
    `is_deleted` TINYINT(1) DEFAULT 0,
    `udc_industry_type` VARCHAR(100) DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`udc_industry_type`) REFERENCES `units_dynamic_central` (`code`)
);
