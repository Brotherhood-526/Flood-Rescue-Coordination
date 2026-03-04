SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `Message`;
DROP TABLE IF EXISTS `RescueTeamAssignment`;
DROP TABLE IF EXISTS `RequestImage`;
DROP TABLE IF EXISTS `Vehicle`;
DROP TABLE IF EXISTS `Request`;
DROP TABLE IF EXISTS `Account`;
DROP TABLE IF EXISTS `Citizen`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `Citizen` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_citizen_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Account` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL,
  `team_name` VARCHAR(255) DEFAULT NULL,
  `team_size` INT DEFAULT NULL,
  `latitude` DECIMAL(18,10) DEFAULT NULL,
  `longitude` DECIMAL(18,10) DEFAULT NULL,
  `account_state` VARCHAR(20) NOT NULL DEFAULT 'offline',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_account_phone` (`phone`),
  CONSTRAINT `ck_account_role` CHECK (`role` IN ('manager', 'rescue coordinator', 'rescue team')),
  CONSTRAINT `ck_account_state` CHECK (`account_state` IN ('active', 'offline'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Request` (
  `id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `description` LONGTEXT,
  `address` VARCHAR(200) DEFAULT NULL,
  `latitude` DECIMAL(18,10) NOT NULL,
  `longitude` DECIMAL(18,10) NOT NULL,
  `additional_link` VARCHAR(200) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'processing',
  `urgency` VARCHAR(20) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_request_user` (`user_id`),
  KEY `idx_request_status_created` (`status`, `created_at`),
  CONSTRAINT `fk_request_user` FOREIGN KEY (`user_id`) REFERENCES `Citizen` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_request_type` CHECK (`type` IN ('goods', 'rescue', 'others')),
  CONSTRAINT `ck_request_status` CHECK (`status` IN ('processing', 'reject', 'delayed', 'accept', 'completed')),
  CONSTRAINT `ck_request_urgency` CHECK (`urgency` IN ('high', 'medium', 'low'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `RequestImage` (
  `id` CHAR(36) NOT NULL,
  `image_url` LONGTEXT NOT NULL,
  `request_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_request_image_request` (`request_id`),
  CONSTRAINT `fk_request_image_request` FOREIGN KEY (`request_id`) REFERENCES `Request` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Vehicle` (
  `id` CHAR(36) NOT NULL,
  `type` VARCHAR(30) NOT NULL,
  `rescue_team_id` CHAR(36) NOT NULL,
  `state` VARCHAR(20) NOT NULL DEFAULT 'free',
  PRIMARY KEY (`id`),
  KEY `idx_vehicle_team` (`rescue_team_id`),
  CONSTRAINT `fk_vehicle_team` FOREIGN KEY (`rescue_team_id`) REFERENCES `Account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_vehicle_type` CHECK (`type` IN ('Boat', 'Rescue Vehicle', 'Helicopter')),
  CONSTRAINT `ck_vehicle_state` CHECK (`state` IN ('using', 'free', 'maintenance'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `RescueTeamAssignment` (
  `id` CHAR(36) NOT NULL,
  `request_id` CHAR(36) NOT NULL,
  `coordinator_id` CHAR(36) NOT NULL,
  `rescue_team_id` CHAR(36) NOT NULL,
  `vehicle_id` CHAR(36) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'on the way',
  `report` LONGTEXT,
  PRIMARY KEY (`id`),
  KEY `idx_assignment_request` (`request_id`),
  KEY `idx_assignment_coordinator` (`coordinator_id`),
  KEY `idx_assignment_rescue_team` (`rescue_team_id`),
  KEY `idx_assignment_vehicle` (`vehicle_id`),
  CONSTRAINT `fk_assignment_request` FOREIGN KEY (`request_id`) REFERENCES `Request` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignment_coordinator` FOREIGN KEY (`coordinator_id`) REFERENCES `Account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignment_rescue_team` FOREIGN KEY (`rescue_team_id`) REFERENCES `Account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignment_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_assignment_status` CHECK (`status` IN ('on the way', 'completed', 'delayed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Message` (
  `id` CHAR(36) NOT NULL,
  `request_id` CHAR(36) NOT NULL,
  `sender_id` CHAR(36) NOT NULL,
  `sender_role` VARCHAR(20) NOT NULL,
  `sender_name` VARCHAR(255) NOT NULL,
  `content` LONGTEXT,
  `send_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_message_request_sendat` (`request_id`, `send_at`),
  CONSTRAINT `fk_message_request` FOREIGN KEY (`request_id`) REFERENCES `Request` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_message_sender_role` CHECK (`sender_role` IN ('citizen', 'coordinator', 'rescue team'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
