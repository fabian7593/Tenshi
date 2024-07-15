
DROP DATABASE IF EXISTS `easy_api_land_db`;
CREATE DATABASE `easy_api_land_db`;
USE `easy_api_land_db`;

# This is the table of roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(35) NOT NULL UNIQUE,
  `name` VARCHAR(50),
  `description` VARCHAR(400) DEFAULT NULL,
  `app_guid` VARCHAR(200) DEFAULT NULL,
  INDEX `idx_code` (`code`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `screens`;
CREATE TABLE IF NOT EXISTS `screens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100),
  `description` VARCHAR(400) DEFAULT NULL,
  `app_guid` VARCHAR(200) DEFAULT NULL,
  INDEX `idx_code` (`code`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


# Screen access roles
DROP TABLE IF EXISTS `role_screen`;
CREATE TABLE IF NOT EXISTS `role_screen` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_code` VARCHAR(35) NOT NULL,
  `screen_code` VARCHAR(50) NOT NULL,
  `description` VARCHAR(400) DEFAULT NULL,
  `app_guid` VARCHAR(200) DEFAULT NULL,
  FOREIGN KEY (`role_code`) REFERENCES `roles` (`code`),
  FOREIGN KEY (`screen_code`) REFERENCES `screens` (`code`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



DROP TABLE IF EXISTS `role_functionallity`;
CREATE TABLE IF NOT EXISTS `role_functionallity` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_code` VARCHAR(35) NOT NULL,
  `func_type` ENUM('C', 'R', 'U', 'D'),
  `function_code` VARCHAR(50) NOT NULL,
  `screen_code` VARCHAR(50) NULL,
  `description` VARCHAR(400) DEFAULT NULL,
  `app_guid` VARCHAR(200) DEFAULT NULL,
  FOREIGN KEY (`role_code`) REFERENCES `roles` (`code`),
  FOREIGN KEY (`screen_code`) REFERENCES `screens` (`code`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


# thsi table hae the information of the users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `card_id` INT UNSIGNED NULL,
  `first_name` VARCHAR(250) NOT NULL,
  `last_name` VARCHAR(250) NOT NULL,
  `email` VARCHAR(250) NOT NULL UNIQUE,
  `phone_number` VARCHAR(250) DEFAULT NULL,
  `password` VARCHAR(250) NOT NULL,
  `gender` ENUM('M', 'F', 'O'),
  `birth_date` DATETIME DEFAULT NULL,
  `country_iso_code` VARCHAR(3) DEFAULT NULL,
  `role_code` VARCHAR(35) NOT NULL,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 0,
  `fail_login_number` INT UNSIGNED DEFAULT 0,
  `forgot_password_token` VARCHAR(400) DEFAULT NULL,
  `active_register_token` VARCHAR(400) DEFAULT NULL,
  `latitude` DECIMAL(11, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `app_guid` VARCHAR(200) DEFAULT NULL,
  FOREIGN KEY (`role_code`) REFERENCES `roles` (`code`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(60) NOT NULL UNIQUE,
    `type` varchar(30) DEFAULT "GENERAL",
    `subject` VARCHAR(100) NOT NULL,
    `message` VARCHAR(250) NOT NULL,
    `required_send_email` TINYINT(1) DEFAULT 0,
    `is_delete_after_read` TINYINT(1) DEFAULT 1,
    `action_url` VARCHAR(400) DEFAULT NULL,
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `app_guid` VARCHAR(200) DEFAULT NULL,
  INDEX `idx_code` (`code`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `user_notifications`;
CREATE TABLE `user_notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `id_user_send` INT UNSIGNED DEFAULT NULL,
    `id_user_receive` INT UNSIGNED NOT NULL,
    `notification_code` VARCHAR(60) NOT NULL,
    `is_read` TINYINT(1) DEFAULT 0,
    `is_deleted` TINYINT(1) DEFAULT 0,
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `app_guid` VARCHAR(200) DEFAULT NULL
    FOREIGN KEY (`notification_code`) REFERENCES `notifications` (`code`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



# This table have dynamic information and categories
/*
    `project_category` ENUM('RECONSTRUCTION', 'EXTENSION', 'NEW', 'FONATEL', 'REPAIRING', 'OTHER')
    `project_status` ENUM('FINISHED', 'STARTED', 'IN_CONSTRUCTION', 'PAUSED', 'IN_RETURN')

    `product_category` ENUM('Cable', 'Nap', 'otros')
    `product_quality` ENUM('Original', 'Generico', 'Triple A')

    `vehicle_type` ENUM('SUV', 'SEDAN', 'PICKUP')
    `vehicle_brand` ENUM('TOYOTA', 'NISSAN', 'ETC')
*/
DROP TABLE IF EXISTS `units_dynamic_central`;
CREATE TABLE IF NOT EXISTS `units_dynamic_central` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(100) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('PROJECT_TYPE', 'PROJECT_CATEGORY', 'INDUSTRY_TYPE'),
    `description` VARCHAR(400) DEFAULT NULL,
    `value1` VARCHAR(300) NOT NULL, # value selected on DROP down
    `value2` VARCHAR(300) DEFAULT NULL, # value in another language
    `value3` VARCHAR(300) DEFAULT NULL, 
    `value4` VARCHAR(300) DEFAULT NULL,
    `value5` VARCHAR(300) DEFAULT NULL,
    `country_iso_code` VARCHAR(3) DEFAULT NULL,
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_date` DATETIME DEFAULT NULL,
    `is_deleted` TINYINT(1) DEFAULT 0,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `user_updated_id` INT UNSIGNED DEFAULT NULL,
    `app_guid` VARCHAR(200) DEFAULT NULL
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



# This is the table of documents
DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(250) NOT NULL UNIQUE,
  `code` VARCHAR(500) NOT NULL UNIQUE,
  `file_name` VARCHAR(250) NOT NULL,
  `extension` VARCHAR(10) NOT NULL,
  `action_type` VARCHAR(100) NOT NULL, -- PROFILE_PICTURE, GENERAL_GALLERY, PERSONAL_DOCUMENT
  `type` ENUM('DOC', 'IMG', 'OTHER') DEFAULT 'IMG',
  `description` VARCHAR(400) DEFAULT NULL,
  `url` VARCHAR(500) DEFAULT NULL,
  `id_for_table` INT UNSIGNED NOT NULL,
  `table` VARCHAR(100) DEFAULT 'GENERAL',
  `is_deleted` TINYINT(1) DEFAULT 0,
  `is_public` TINYINT(1) DEFAULT 0,
  `user_id` INT UNSIGNED NOT NULL,
  `app_guid` VARCHAR(200) DEFAULT NULL,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `method` VARCHAR(200) NOT NULL,
  `class` VARCHAR(200) NOT NULL, 
  `type` VARCHAR(40) DEFAULT NULL, 
  `https` INT DEFAULT NULL,
  `message` VARCHAR(800) NOT NULL,
  `description` VARCHAR(400) DEFAULT NULL,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user_id` VARCHAR(200) DEFAULT NULL,
  `app_guid` VARCHAR(200) DEFAULT NULL,
  `environment` VARCHAR(200) DEFAULT NULL
) ENGINE = InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



