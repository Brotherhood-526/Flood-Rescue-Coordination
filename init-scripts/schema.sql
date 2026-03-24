use railway;

DROP TABLE IF EXISTS RequestImage;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS RescueTeamAssignment;
DROP TABLE IF EXISTS Vehicle;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Request;
DROP TABLE IF EXISTS Citizen;
-- Hãy thay tên chính xác của bảng RescueTeam dưới đây:

-- 2. Bảng citizen
CREATE TABLE citizen (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- 3. Bảng staff
CREATE TABLE staff (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('rescue manager', 'rescue coordinator', 'rescue team') NOT NULL,
    team_name VARCHAR(50),
    team_size INT,
    latitude DECIMAL(18, 10),
    longitude DECIMAL(18, 10),
    /*
    Chỉ mục không gian (Spatial Index) sử dụng cấu trúc R-Tree. 
    Để cấu trúc này hoạt động chính xác trong việc phân vùng không gian (bounding boxes), 
    nó cần đảm bảo mọi bản ghi đều có tọa độ xác định. 
    Nếu một dòng dữ liệu có tọa độ "vô định" (NULL), hệ thống sẽ không biết 
    xếp nó vào phân vùng nào, dẫn đến lỗi chỉ mục.
    */
    geo_location POINT SRID 4326 NOT NULL,
    staff_state ENUM('active', 'offline') DEFAULT 'offline'
) ENGINE=InnoDB;

-- 4. Bảng vehicle
CREATE TABLE vehicle (
    id CHAR(36) PRIMARY KEY,
    type ENUM('Boat', 'Rescue vehicle', 'Helicopter') NOT NULL,
    rescue_team_id CHAR(36) NOT NULL,
    state ENUM('using', 'free', 'maintenance') DEFAULT 'free',
    CONSTRAINT fk_vehicle_staff FOREIGN KEY (rescue_team_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Bảng request
CREATE TABLE request (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    type ENUM('goods', 'rescue', 'others') NOT NULL,
    description TEXT,
    address VARCHAR(200),
    latitude DECIMAL(18, 10) NOT NULL,
    longitude DECIMAL(18, 10) NOT NULL,
    geo_location POINT SRID 4326 NOT NULL,
    additional_link VARCHAR(200),
    status ENUM('processing', 'reject', 'delayed', 'completed', 'accept') DEFAULT 'processing',
    urgency ENUM('high', 'medium', 'low') NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    coordinator_id CHAR(36) NULL,
    rescue_team_id CHAR(36) NULL,
    vehicle_id CHAR(36) NULL,
    report TEXT NULL,

    CONSTRAINT fk_request_citizen FOREIGN KEY (user_id) REFERENCES citizen(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_coord FOREIGN KEY (coordinator_id) REFERENCES staff(id),
    CONSTRAINT fk_request_team FOREIGN KEY (rescue_team_id) REFERENCES staff(id),
    CONSTRAINT fk_request_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(id)
) ENGINE=InnoDB;

-- 6. Bảng requestImage
CREATE TABLE requestImage (
    id CHAR(36) PRIMARY KEY,
    request_id CHAR(36) NOT NULL,
    image_url TEXT NOT NULL,
    CONSTRAINT fk_image_request FOREIGN KEY (request_id) REFERENCES request(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Bảng Message
CREATE TABLE message (
    id CHAR(36) PRIMARY KEY,
    request_id CHAR(36) NOT NULL,
    sender_user_id CHAR(36) NULL,
    sender_staff_id CHAR(36) NULL,
    sender_role ENUM('citizen', 'rescue coordinator', 'rescue team', 'rescue manager') NOT NULL,
    content TEXT,
    send_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_msg_request FOREIGN KEY (request_id) REFERENCES request(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_citizen FOREIGN KEY (sender_user_id) REFERENCES citizen(id),
    CONSTRAINT fk_msg_staff FOREIGN KEY (sender_staff_id) REFERENCES staff(id)
) ENGINE=InnoDB;

DELIMITER //

-- Triggers cho staff
CREATE TRIGGER tr_staff_spatial_insert BEFORE INSERT ON staff
FOR EACH ROW BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
    ELSE
        SET NEW.geo_location = ST_SRID(POINT(0, 0), 4326);
    END IF;
END//

CREATE TRIGGER tr_staff_spatial_update BEFORE UPDATE ON staff
FOR EACH ROW BEGIN
    IF NEW.latitude <> OLD.latitude OR NEW.longitude <> OLD.longitude THEN
        IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
            SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
        ELSE
            SET NEW.geo_location = ST_SRID(POINT(0, 0), 4326);
        END IF;
    END IF;
END//

-- Triggers cho request (SỬA LỖI 1364 Ở ĐÂY)
CREATE TRIGGER tr_request_spatial_insert BEFORE INSERT ON request
FOR EACH ROW BEGIN
    -- request luôn có vĩ độ/kinh độ NOT NULL nên không cần check ELSE
    SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
END//

CREATE TRIGGER tr_request_spatial_update BEFORE UPDATE ON request
FOR EACH ROW BEGIN
    IF NEW.latitude <> OLD.latitude OR NEW.longitude <> OLD.longitude THEN
        SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
    END IF;
END//

DELIMITER ;

-- Chuẩn bị biến ID
SET @CoordinatorId = UUID();
SET @RescueTeamId = UUID();
SET @vehicleId = UUID();
SET @Coordinator2Id = UUID();
SET @RescueTeam2Id = UUID();
SET @vehicle2Id = UUID();
SET @citizenId = UUID();
SET @ReqCompletedId = UUID();
SET @ReqRejectId = UUID();
SET @ReqActiveId = UUID();

-- 1. staff & vehicles
INSERT INTO staff (id, name, phone, password, role, staff_state)
VALUES (@CoordinatorId, 'Lê Quản Lý', '0123456789', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue coordinator', 'active');

INSERT INTO staff (id, name, phone, password, role, team_name, team_size, latitude, longitude, staff_state)
VALUES (@RescueTeamId, 'Đội Trưởng Húng', '0988888888', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue team', 'Biệt đội Cá Heo', 5, 10.8231, 106.6297, 'active');

INSERT INTO vehicle (id, type, rescue_team_id, state)
VALUES (@vehicleId, 'Boat', @RescueTeamId, 'using');

INSERT INTO staff (id, name, phone, password, role, staff_state)
VALUES (@Coordinator2Id, 'Nguyễn Điều Phối', '0911222333', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue coordinator', 'active');

INSERT INTO staff (id, name, phone, password, role, team_name, team_size, staff_state)
VALUES (@RescueTeam2Id, 'Đội Cứu Hộ Sao Vàng', '0944555666', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue team', 'Sao Vàng Team', 8, 'active');

INSERT INTO vehicle (id, type, rescue_team_id, state)
VALUES (@vehicle2Id, 'Rescue vehicle', @RescueTeam2Id, 'free');

-- 2. citizen
INSERT INTO citizen (id, name, phone) 
VALUES (@citizenId, 'Nguyễn Văn Dân', '0912345678');

-- 3. requests
INSERT INTO request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqCompletedId, @citizenId, 'rescue', 'Cần sơ tán khẩn cấp (Đã xong)', '789 Đường ven đê', 10.7890, 106.7890, 'completed', 'high', DATE_SUB(NOW(), INTERVAL 2 HOUR), @Coordinator2Id, @RescueTeam2Id, @vehicle2Id, 'Đã hoàn thành việc sơ tán 5 người già và 2 trẻ em an toàn.');

INSERT INTO request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at)
VALUES (@ReqRejectId, @citizenId, 'goods', 'Cần hỗ trợ lương thực (Bị từ chối)', '456 Đường Hẻm Sâu', 10.5678, 106.5678, 'reject', 'medium', DATE_SUB(NOW(), INTERVAL 1 HOUR));

INSERT INTO request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqActiveId, @citizenId, 'rescue', 'Nước đang dâng cao, cần xuồng gấp (Mới nhất)', '123 Đường ven sông', 10.1234, 106.1234, 'accept', 'high', NOW(), @CoordinatorId, @RescueTeamId, @vehicleId, 'Đang di chuyển tiếp cận hiện trường');

-- 4. request Images (Đã bổ sung đầy đủ)
INSERT INTO requestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqActiveId);

INSERT INTO requestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqRejectId);

INSERT INTO requestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqCompletedId);

SELECT 
    r.id AS requestId,
    r.address,
    r.description,
    DATE_FORMAT(r.created_at, '%Y-%m-%dT%H:%i:%s') AS createdAt,
    r.latitude,
    r.longitude,
    r.geo_location,
    r.status,
    r.type,
    r.urgency,
    r.report AS rescueReport,
    c.name AS citizenName,
    c.phone AS citizenPhone,
    s_coord.name AS coordinatorName,
    s_team.name AS rescueLeaderName,
    s_team.team_name AS teamName,
    v.type AS vehicleType,
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', ri.id, 'imageUrl', ri.image_url))
        FROM requestImage ri
        WHERE ri.request_id = r.id
    ) AS images
FROM request r
INNER JOIN citizen c ON r.user_id = c.id
LEFT JOIN staff s_coord ON r.coordinator_id = s_coord.id
LEFT JOIN staff s_team ON r.rescue_team_id = s_team.id
LEFT JOIN vehicle v ON r.vehicle_id = v.id
WHERE c.phone = '0912345678'
ORDER BY r.created_at DESC;

SELECT * FROM staff;
res.cloudinary.com
15:42
Võ
use railway;

DROP TABLE IF EXISTS RequestImage;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Request;
DROP TABLE IF EXISTS Citizen;
DROP TABLE IF EXISTS Vehicle;
DROP TABLE IF EXISTS Staff;
-- Hãy thay tên chính xác của bảng RescueTeam dưới đây:

-- 2. Bảng citizen
CREATE TABLE Citizen (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- 3. Bảng staff
CREATE TABLE Staff (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('rescue manager', 'rescue coordinator', 'rescue team') NOT NULL,
    team_name VARCHAR(50),
    team_size INT,
    latitude DECIMAL(18, 10),
    longitude DECIMAL(18, 10),
    /*
    Chỉ mục không gian (Spatial Index) sử dụng cấu trúc R-Tree. 
    Để cấu trúc này hoạt động chính xác trong việc phân vùng không gian (bounding boxes), 
    nó cần đảm bảo mọi bản ghi đều có tọa độ xác định. 
    Nếu một dòng dữ liệu có tọa độ "vô định" (NULL), hệ thống sẽ không biết 
    xếp nó vào phân vùng nào, dẫn đến lỗi chỉ mục.
    */
    geo_location POINT SRID 4326 NOT NULL,
    staff_state ENUM('active', 'offline') DEFAULT 'offline'
) ENGINE=InnoDB;

-- 4. Bảng vehicle
CREATE TABLE Vehicle (
    id CHAR(36) PRIMARY KEY,
    type ENUM('Boat', 'Rescue vehicle', 'Helicopter') NOT NULL,
    rescue_team_id CHAR(36) NOT NULL,
    state ENUM('using', 'free', 'maintenance') DEFAULT 'free',
    CONSTRAINT fk_vehicle_staff FOREIGN KEY (rescue_team_id) REFERENCES Staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Bảng request
CREATE TABLE Request (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    type ENUM('goods', 'rescue', 'others') NOT NULL,
    description TEXT,
    address VARCHAR(200),
    latitude DECIMAL(18, 10) NOT NULL,
    longitude DECIMAL(18, 10) NOT NULL,
    geo_location POINT SRID 4326 NOT NULL,
    additional_link VARCHAR(200),
    status ENUM('processing', 'reject', 'delayed', 'completed', 'accept') DEFAULT 'processing',
    urgency ENUM('high', 'medium', 'low') NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    coordinator_id CHAR(36) NULL,
    rescue_team_id CHAR(36) NULL,
    vehicle_id CHAR(36) NULL,
    report TEXT NULL,

    CONSTRAINT fk_request_citizen FOREIGN KEY (user_id) REFERENCES Citizen(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_coord FOREIGN KEY (coordinator_id) REFERENCES Staff(id),
    CONSTRAINT fk_request_team FOREIGN KEY (rescue_team_id) REFERENCES Staff(id),
    CONSTRAINT fk_request_vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id)
) ENGINE=InnoDB;

-- 6. Bảng requestImage
CREATE TABLE RequestImage (
    id CHAR(36) PRIMARY KEY,
    request_id CHAR(36) NOT NULL,
    image_url TEXT NOT NULL,
    CONSTRAINT fk_image_request FOREIGN KEY (request_id) REFERENCES Request(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Bảng Message
CREATE TABLE Message (
    id CHAR(36) PRIMARY KEY,
    request_id CHAR(36) NOT NULL,
    sender_user_id CHAR(36) NULL,
    sender_staff_id CHAR(36) NULL,
    sender_role ENUM('citizen', 'rescue coordinator', 'rescue team', 'rescue manager') NOT NULL,
    content TEXT,
    send_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_msg_request FOREIGN KEY (request_id) REFERENCES Request(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_citizen FOREIGN KEY (sender_user_id) REFERENCES Citizen(id),
    CONSTRAINT fk_msg_staff FOREIGN KEY (sender_staff_id) REFERENCES Staff(id)
) ENGINE=InnoDB;

DELIMITER //

-- Triggers cho staff
CREATE TRIGGER tr_staff_spatial_insert BEFORE INSERT ON Staff
FOR EACH ROW BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
    ELSE
        SET NEW.geo_location = ST_SRID(POINT(0, 0), 4326);
    END IF;
END//

CREATE TRIGGER tr_staff_spatial_update BEFORE UPDATE ON Staff
FOR EACH ROW BEGIN
    IF NEW.latitude <> OLD.latitude OR NEW.longitude <> OLD.longitude THEN
        IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
            SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
        ELSE
            SET NEW.geo_location = ST_SRID(POINT(0, 0), 4326);
        END IF;
    END IF;
END//

-- Triggers cho request (SỬA LỖI 1364 Ở ĐÂY)
CREATE TRIGGER tr_request_spatial_insert BEFORE INSERT ON Request
FOR EACH ROW BEGIN
    -- request luôn có vĩ độ/kinh độ NOT NULL nên không cần check ELSE
    SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
END//

CREATE TRIGGER tr_request_spatial_update BEFORE UPDATE ON Request
FOR EACH ROW BEGIN
    IF NEW.latitude <> OLD.latitude OR NEW.longitude <> OLD.longitude THEN
        SET NEW.geo_location = ST_SRID(POINT(NEW.longitude, NEW.latitude), 4326);
    END IF;
END//

DELIMITER ;

-- Chuẩn bị biến ID
SET @CoordinatorId = UUID();
SET @RescueTeamId = UUID();
SET @vehicleId = UUID();
SET @Coordinator2Id = UUID();
SET @RescueTeam2Id = UUID();
SET @vehicle2Id = UUID();
SET @citizenId = UUID();
SET @ReqCompletedId = UUID();
SET @ReqRejectId = UUID();
SET @ReqActiveId = UUID();

-- 1. staff & vehicles
INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@CoordinatorId, 'Lê Quản Lý', '0123456789', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue coordinator', 'active');

INSERT INTO Staff (id, name, phone, password, role, team_name, team_size, latitude, longitude, staff_state)
VALUES (@RescueTeamId, 'Đội Trưởng Húng', '0988888888', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue team', 'Biệt đội Cá Heo', 5, 10.8231, 106.6297, 'active');

INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@vehicleId, 'Boat', @RescueTeamId, 'using');

INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@Coordinator2Id, 'Nguyễn Điều Phối', '0911222333', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue coordinator', 'active');

INSERT INTO Staff (id, name, phone, password, role, team_name, team_size, staff_state)
VALUES (@RescueTeam2Id, 'Đội Cứu Hộ Sao Vàng', '0944555666', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue team', 'Sao Vàng Team', 8, 'active');

INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@vehicle2Id, 'Rescue vehicle', @RescueTeam2Id, 'free');

-- 2. citizen
INSERT INTO Citizen (id, name, phone) 
VALUES (@citizenId, 'Nguyễn Văn Dân', '0912345678');

-- 3. requests
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqCompletedId, @citizenId, 'rescue', 'Cần sơ tán khẩn cấp (Đã xong)', '789 Đường ven đê', 10.7890, 106.7890, 'completed', 'high', DATE_SUB(NOW(), INTERVAL 2 HOUR), @Coordinator2Id, @RescueTeam2Id, @vehicle2Id, 'Đã hoàn thành việc sơ tán 5 người già và 2 trẻ em an toàn.');

INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at)
VALUES (@ReqRejectId, @citizenId, 'goods', 'Cần hỗ trợ lương thực (Bị từ chối)', '456 Đường Hẻm Sâu', 10.5678, 106.5678, 'reject', 'medium', DATE_SUB(NOW(), INTERVAL 1 HOUR));

INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqActiveId, @citizenId, 'rescue', 'Nước đang dâng cao, cần xuồng gấp (Mới nhất)', '123 Đường ven sông', 10.1234, 106.1234, 'accept', 'high', NOW(), @CoordinatorId, @RescueTeamId, @vehicleId, 'Đang di chuyển tiếp cận hiện trường');

-- 4. request Images (Đã bổ sung đầy đủ)
INSERT INTO RequestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqActiveId);

INSERT INTO RequestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqRejectId);

INSERT INTO RequestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqCompletedId);

SELECT 
    r.id AS requestId,
    r.address,
    r.description,
    DATE_FORMAT(r.created_at, '%Y-%m-%dT%H:%i:%s') AS createdAt,
    r.latitude,
    r.longitude,
    r.geo_location,
    r.status,
    r.type,
    r.urgency,
    r.report AS rescueReport,
    c.name AS citizenName,
    c.phone AS citizenPhone,
    s_coord.name AS coordinatorName,
    s_team.name AS rescueLeaderName,
    s_team.team_name AS teamName,
    v.type AS vehicleType,
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', ri.id, 'imageUrl', ri.image_url))
        FROM RequestImage ri
        WHERE ri.request_id = r.id
    ) AS images
FROM Request r
INNER JOIN Citizen c ON r.user_id = c.id
LEFT JOIN Staff s_coord ON r.coordinator_id = s_coord.id
LEFT JOIN Staff s_team ON r.rescue_team_id = s_team.id
LEFT JOIN Vehicle v ON r.vehicle_id = v.id
WHERE c.phone = '0912345678'
ORDER BY r.created_at DESC;

SELECT * FROM Staff;