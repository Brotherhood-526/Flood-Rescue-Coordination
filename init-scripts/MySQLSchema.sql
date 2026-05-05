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
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Bảng Staff (Nhân viên/Đội cứu hộ)
CREATE TABLE Staff (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    -- Vai trò: quản lý, điều phối viên, cứu hộ
    role ENUM('quản lý', 'điều phối viên', 'cứu hộ') NOT NULL,
    team_name VARCHAR(50),
    team_size INT,
    latitude DECIMAL(18, 10),
    longitude DECIMAL(18, 10),
    geo_location POINT SRID 4326 NOT NULL,
    -- Trạng thái: hoạt động, không hoạt động
    staff_state ENUM('hoạt động', 'không hoạt động') DEFAULT 'hoạt động'
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Bảng Vehicle (Phương tiện)
CREATE TABLE Vehicle (
    id CHAR(36) PRIMARY KEY,
    -- Loại: xuồng, xe cứu hộ, trực thăng
    type ENUM('xuồng', 'xe cứu hộ', 'trực thăng') NOT NULL,
    rescue_team_id CHAR(36) NOT NULL,
    -- Trạng thái: đang sử dụng, không hoạt động, bảo trì
    state ENUM('đang sử dụng', 'không hoạt động', 'bảo trì') DEFAULT 'không hoạt động',
    CONSTRAINT fk_vehicle_staff FOREIGN KEY (rescue_team_id) REFERENCES Staff(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Bảng Request (Yêu cầu cứu hộ)
CREATE TABLE Request (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    -- Loại: tiếp tế, cứu hộ, khác
    type ENUM('tiếp tế', 'cứu hộ', 'khác') NOT NULL,
    description TEXT,
    address VARCHAR(200),
    latitude DECIMAL(18, 10) NOT NULL,
    longitude DECIMAL(18, 10) NOT NULL,
    geo_location POINT SRID 4326 NOT NULL,
    additional_link VARCHAR(200),
    -- Trạng thái: đang xử lý, đã huỷ, tạm hoãn, hoàn thành, yêu cầu mới
    status ENUM('đang xử lý', 'đã huỷ', 'tạm hoãn', 'hoàn thành', 'yêu cầu mới') DEFAULT 'yêu cầu mới',
    -- Mức độ khẩn cấp: cao, trung bình, thấp
    urgency ENUM('cao', 'trung bình', 'thấp') NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    coordinator_id CHAR(36) NULL,
    rescue_team_id CHAR(36) NULL,
    vehicle_id CHAR(36) NULL,
    report TEXT NULL,

    CONSTRAINT fk_request_citizen FOREIGN KEY (user_id) REFERENCES Citizen(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_coord FOREIGN KEY (coordinator_id) REFERENCES Staff(id),
    CONSTRAINT fk_request_team FOREIGN KEY (rescue_team_id) REFERENCES Staff(id),
    CONSTRAINT fk_request_vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Bảng RequestImage (Ảnh đính kèm yêu cầu)
CREATE TABLE RequestImage (
    id CHAR(36) PRIMARY KEY,
    request_id CHAR(36) NOT NULL,
    image_url TEXT NOT NULL,
    CONSTRAINT fk_image_request FOREIGN KEY (request_id) REFERENCES Request(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. Bảng Message (Tin nhắn trao đổi)
CREATE TABLE Message (
    id CHAR(36) PRIMARY KEY,
    request_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NULL,
    -- Vai trò người gửi: người dân, điều phối viên, cứu hộ, quản lý
    sender_role ENUM('người dân', 'điều phối viên', 'cứu hộ', 'quản lý') NOT NULL,
    content TEXT,
    send_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_msg_request FOREIGN KEY (request_id) REFERENCES Request(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
SET @Admin1Id = UUID();
SET @Admin2Id = UUID();
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

-- 0. Thêm 2 tài khoản Quản lý (Manager)
INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@Admin1Id, 'Trần Trung Kiên (Admin)', '0901112223', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'quản lý', 'hoạt động');

INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@Admin2Id, 'Phạm Minh Đức (Admin)', '0904445556', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'quản lý', 'hoạt động');

-- 1. staff & vehicles
INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@CoordinatorId, 'Lê Quản Lý', '0123456789', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'điều phối viên', 'hoạt động');

INSERT INTO Staff (id, name, phone, password, role, team_name, team_size, latitude, longitude, staff_state)
VALUES (@RescueTeamId, 'Đội Trưởng Húng', '0988888888', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Biệt đội Cá Heo', 5, 10.8231, 106.6297, 'hoạt động');

INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@vehicleId, 'xuồng', @RescueTeamId, 'đang sử dụng');

INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@Coordinator2Id, 'Nguyễn Điều Phối', '0911222333', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'điều phối viên', 'hoạt động');

INSERT INTO Staff (id, name, phone, password, role, team_name, team_size, latitude, longitude, staff_state)
VALUES (@RescueTeam2Id, 'Đội Cứu Hộ Sao Vàng', '0944555666', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Sao Vàng Team', 8, 10.7626, 106.6602, 'hoạt động');

INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@vehicle2Id, 'xe cứu hộ', @RescueTeam2Id, 'không hoạt động');

-- =========================================================================
-- 1. THÊM 10 ĐỘI CỨU HỘ VÀO BẢNG STAFF (DỮ LIỆU THẬT TẠI TP.HCM)
-- =========================================================================
INSERT INTO Staff (id, name, phone, password, role, team_name, team_size, latitude, longitude, staff_state)
VALUES
-- 1. Khu vực Chợ Bến Thành (Quận 1)
('00000000-0000-0000-0000-000000000001', 'Nguyễn Minh Khôi', '0980000001', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Trung Tâm Quận 1', 12, 10.7725, 106.6980, 'hoạt động'),

-- 2. Khu vực Nhà thờ Đức Bà (Quận 1)
('00000000-0000-0000-0000-000000000002', 'Trần Quốc Bảo', '0980000002', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Đức Bà', 8, 10.7798, 106.6990, 'hoạt động'),

-- 3. Khu vực Landmark 81 (Bình Thạnh)
('00000000-0000-0000-0000-000000000003', 'Lê Hoàng Nam', '0980000003', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Bình Thạnh', 15, 10.7931, 106.7218, 'hoạt động'),

-- 4. Khu vực Sân bay Tân Sơn Nhất (Tân Bình)
('00000000-0000-0000-0000-000000000004', 'Phạm Anh Tuấn', '0980000004', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Tân Sơn Nhất', 10, 10.8165, 106.6660, 'hoạt động'),

-- 5. Khu vực Đầm Sen (Quận 11)
('00000000-0000-0000-0000-000000000005', 'Võ Thanh Hùng', '0980000005', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Đầm Sen', 6, 10.7686, 106.6385, 'hoạt động'),

-- 6. Khu vực Suối Tiên (Thủ Đức)
('00000000-0000-0000-0000-000000000006', 'Nguyễn Văn Phúc', '0980000006', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Suối Tiên', 9, 10.8624, 106.8021, 'hoạt động'),

-- 7. Khu vực Cầu Ánh Sao (Quận 7)
('00000000-0000-0000-0000-000000000007', 'Đặng Quốc Duy', '0980000007', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Quận 7', 14, 10.7289, 106.7215, 'hoạt động'),

-- 8. Khu vực AEON Mall (Tân Phú)
('00000000-0000-0000-0000-000000000008', 'Huỳnh Gia Bảo', '0980000008', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Tân Phú', 7, 10.8016, 106.6176, 'hoạt động'),

-- 9. Khu vực Bến xe Miền Đông mới (Thủ Đức)
('00000000-0000-0000-0000-000000000009', 'Phan Đức Long', '0980000009', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Thủ Đức', 11, 10.8643, 106.8152, 'hoạt động'),

-- 10. Khu vực Bến xe Miền Tây (Bình Tân)
('00000000-0000-0000-0000-000000000010', 'Trương Công Thành', '0980000010', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'cứu hộ', 'Đội Bình Tân', 5, 10.7327, 106.6080, 'hoạt động');

-- =========================================================================
-- THÊM 40 PHƯƠNG TIỆN (Thỏa mãn ràng buộc của các đội)
-- =========================================================================
INSERT INTO Vehicle (id, type, rescue_team_id, state) VALUES
-- Đội 1 (Đủ loại)
('e0000000-0000-0000-0000-000000000001', 'xe cứu hộ', '00000000-0000-0000-0000-000000000001', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000002', 'xe cứu hộ', '00000000-0000-0000-0000-000000000001', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000003', 'xuồng',     '00000000-0000-0000-0000-000000000001', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000004', 'trực thăng', '00000000-0000-0000-0000-000000000001', 'không hoạt động'),

-- Đội 2 (Đủ loại)
('e0000000-0000-0000-0000-000000000005', 'xe cứu hộ', '00000000-0000-0000-0000-000000000002', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000006', 'xuồng',     '00000000-0000-0000-0000-000000000002', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000007', 'xuồng',     '00000000-0000-0000-0000-000000000002', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000008', 'trực thăng', '00000000-0000-0000-0000-000000000002', 'không hoạt động'),

-- Đội 3 (KHÔNG CÓ XUỒNG)
('e0000000-0000-0000-0000-000000000009', 'xe cứu hộ', '00000000-0000-0000-0000-000000000003', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000010', 'xe cứu hộ', '00000000-0000-0000-0000-000000000003', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000011', 'trực thăng', '00000000-0000-0000-0000-000000000003', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000012', 'trực thăng', '00000000-0000-0000-0000-000000000003', 'không hoạt động'),

-- Đội 4 (KHÔNG CÓ TRỰC THĂNG)
('e0000000-0000-0000-0000-000000000013', 'xe cứu hộ', '00000000-0000-0000-0000-000000000004', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000014', 'xe cứu hộ', '00000000-0000-0000-0000-000000000004', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000015', 'xuồng',     '00000000-0000-0000-0000-000000000004', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000016', 'xuồng',     '00000000-0000-0000-0000-000000000004', 'không hoạt động'),

-- Đội 5 (KHÔNG CÓ XE CỨU HỘ)
('e0000000-0000-0000-0000-000000000017', 'xuồng',     '00000000-0000-0000-0000-000000000005', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000018', 'xuồng',     '00000000-0000-0000-0000-000000000005', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000019', 'trực thăng', '00000000-0000-0000-0000-000000000005', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000020', 'trực thăng', '00000000-0000-0000-0000-000000000005', 'không hoạt động'),

-- Đội 6 (KHÔNG CÓ XUỒNG - 1 bảo trì)
('e0000000-0000-0000-0000-000000000021', 'xe cứu hộ', '00000000-0000-0000-0000-000000000006', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000022', 'xe cứu hộ', '00000000-0000-0000-0000-000000000006', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000023', 'trực thăng', '00000000-0000-0000-0000-000000000006', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000024', 'trực thăng', '00000000-0000-0000-0000-000000000006', 'bảo trì'),

-- Đội 7 (KHÔNG CÓ TRỰC THĂNG - 1 bảo trì)
('e0000000-0000-0000-0000-000000000025', 'xe cứu hộ', '00000000-0000-0000-0000-000000000007', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000026', 'xe cứu hộ', '00000000-0000-0000-0000-000000000007', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000027', 'xuồng',     '00000000-0000-0000-0000-000000000007', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000028', 'xuồng',     '00000000-0000-0000-0000-000000000007', 'bảo trì'),

-- Đội 8 (KHÔNG CÓ XE CỨU HỘ - 1 bảo trì)
('e0000000-0000-0000-0000-000000000029', 'xuồng',     '00000000-0000-0000-0000-000000000008', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000030', 'xuồng',     '00000000-0000-0000-0000-000000000008', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000031', 'trực thăng', '00000000-0000-0000-0000-000000000008', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000032', 'trực thăng', '00000000-0000-0000-0000-000000000008', 'bảo trì'),

-- Đội 9 (Đủ loại - 1 bảo trì)
('e0000000-0000-0000-0000-000000000033', 'xe cứu hộ', '00000000-0000-0000-0000-000000000009', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000034', 'xe cứu hộ', '00000000-0000-0000-0000-000000000009', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000035', 'xuồng',     '00000000-0000-0000-0000-000000000009', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000036', 'trực thăng', '00000000-0000-0000-0000-000000000009', 'bảo trì'),

-- Đội 10 (Đủ loại - 1 bảo trì)
('e0000000-0000-0000-0000-000000000037', 'xe cứu hộ', '00000000-0000-0000-0000-000000000010', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000038', 'xuồng',     '00000000-0000-0000-0000-000000000010', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000039', 'trực thăng', '00000000-0000-0000-0000-000000000010', 'không hoạt động'),
('e0000000-0000-0000-0000-000000000040', 'trực thăng', '00000000-0000-0000-0000-000000000010', 'bảo trì');

-- 2. citizen
INSERT INTO Citizen (id, name, phone) 
VALUES (@citizenId, 'Nguyễn Văn Dân', '0912345678');

INSERT INTO Citizen (id, name, phone) VALUES
('C0000000-0000-0000-0000-000000000001', 'Nguyễn Văn An', '0900000001'),
('C0000000-0000-0000-0000-000000000002', 'Trần Thị Bình', '0900000002'),
('C0000000-0000-0000-0000-000000000003', 'Lê Hoàng Cường', '0900000003'),
('C0000000-0000-0000-0000-000000000004', 'Phạm Mai Dung', '0900000004'),
('C0000000-0000-0000-0000-000000000005', 'Hoàng Bảo Em', '0900000005'),
('C0000000-0000-0000-0000-000000000006', 'Vũ Quốc Phong', '0900000006'),
('C0000000-0000-0000-0000-000000000007', 'Đặng Thu Hà', '0900000007'),
('C0000000-0000-0000-0000-000000000008', 'Bùi Ngọc Yến', '0900000008'),
('C0000000-0000-0000-0000-000000000009', 'Đỗ Minh Tuấn', '0900000009'),
('C0000000-0000-0000-0000-000000000010', 'Hồ Thanh Sang', '0900000010');

-- 3. requests
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqCompletedId, @citizenId, 'cứu hộ', 'Cần sơ tán khẩn cấp (Đã xong)', '789 Đường ven đê', 10.7890, 106.6890, 'hoàn thành', 'cao', DATE_SUB(NOW(), INTERVAL 24 HOUR), @Coordinator2Id, @RescueTeam2Id, @vehicle2Id, 'hoàn thành việc sơ tán 5 người già và 2 trẻ em an toàn.');

INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at)
VALUES (@ReqRejectId, @citizenId, 'tiếp tế', 'Cần hỗ trợ lương thực (Bị đã huỷ)', '456 Đường Hẻm Sâu', 10.7678, 106.6678, 'đã huỷ', 'trung bình', DATE_SUB(NOW(), INTERVAL 12 HOUR));

INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqActiveId, @citizenId, 'cứu hộ', 'Nước đang dâng cao, cần xuồng gấp (Mới nhất)', '123 Đường ven sông', 10.7734, 106.6734, 'yêu cầu mới', 'cao', DATE_SUB(NOW(), INTERVAL 11 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId, 'Đang di chuyển tiếp cận hiện trường');

-- =========================================================================
-- THÊM 50 YÊU CẦU CỨU HỘ 
-- Tọa độ: Các con hẻm, khu dân cư thật tại TP.HCM
-- Thời gian: Tính từ hiện tại lùi về 1 ngày (mới nhất là -1 giờ)
-- =========================================================================
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id) VALUES
-- =======================================================================================
-- Nhóm 1: Người 1, 2, 3 (Mỗi người: 2 Hoàn thành, 2 Hủy, 1 Đang xử lý)
-- Khu vực dân cư Quận 5, Quận 10
-- =======================================================================================
-- Công dân 1 (C0000000...01)
('d0000000-0000-0000-0000-000000000001', 'C0000000-0000-0000-0000-000000000001', 'tiếp tế', 'Cần gạo và nước sạch', 'Hẻm 211 Nguyễn Trãi, Quận 5, Thành Phố Hồ Chí Minh', 10.7618, 106.6805, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 24 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000002', 'C0000000-0000-0000-0000-000000000001', 'cứu hộ', 'Nhà ngập sâu', 'Hẻm 302 Sư Vạn Hạnh, Quận 10, Thành Phố Hồ Chí Minh', 10.7711, 106.6710, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 20 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003'),
('d0000000-0000-0000-0000-000000000003', 'C0000000-0000-0000-0000-000000000001', 'khác', 'Hỏi thông tin đường đi', 'Khu dân cư Phú Thọ, Quận 11, Thành Phố Hồ Chí Minh', 10.7681, 106.6503, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 15 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000004', 'C0000000-0000-0000-0000-000000000001', 'tiếp tế', 'Test hệ thống', 'Hẻm 456 Lê Văn Thọ, Gò Vấp, Thành Phố Hồ Chí Minh', 10.8415, 106.6582, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 10 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000005', 'C0000000-0000-0000-0000-000000000001', 'cứu hộ', 'Có người già bị kẹt', 'Khu Bùi Đình Túy, Bình Thạnh, Thành Phố Hồ Chí Minh', 10.8062, 106.7020, 'đang xử lý', 'cao', DATE_SUB(NOW(), INTERVAL 1 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),

-- Công dân 2 (C0000000...02)
('d0000000-0000-0000-0000-000000000006', 'C0000000-0000-0000-0000-000000000002', 'tiếp tế', 'Cần mì gói', 'Hẻm 112 Xô Viết Nghệ Tĩnh, Bình Thạnh, Thành Phố Hồ Chí Minh', 10.8021, 106.7115, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 23 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000005'),
('d0000000-0000-0000-0000-000000000007', 'C0000000-0000-0000-0000-000000000002', 'cứu hộ', 'Ngập nửa nhà', 'KDC Tân Quy, Quận 7, Thành Phố Hồ Chí Minh', 10.7410, 106.7051, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 19 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000008', 'C0000000-0000-0000-0000-000000000002', 'khác', 'Báo cáo cây đổ', 'Hẻm Phạm Thế Hiển, Quận 8, Thành Phố Hồ Chí Minh', 10.7305, 106.6541, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 14 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000009', 'C0000000-0000-0000-0000-000000000002', 'tiếp tế', 'Xin quần áo', 'Khu Bình Trị Đông, Bình Tân, Thành Phố Hồ Chí Minh', 10.7602, 106.6111, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 9 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000010', 'C0000000-0000-0000-0000-000000000002', 'cứu hộ', 'Nước ngập đến nóc', 'Hẻm Tân Sơn Nhì, Tân Phú, Thành Phố Hồ Chí Minh', 10.8034, 106.6341, 'đang xử lý', 'cao', DATE_SUB(NOW(), INTERVAL 1 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000015'),

-- Công dân 3 (C0000000...03)
('d0000000-0000-0000-0000-000000000011', 'C0000000-0000-0000-0000-000000000003', 'tiếp tế', 'Cần sữa cho bé', 'Đường Lê Lợi, Quận 1, Thành Phố Hồ Chí Minh', 10.7720, 106.6980, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 22 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000011'),
('d0000000-0000-0000-0000-000000000012', 'C0000000-0000-0000-0000-000000000003', 'cứu hộ', 'Di dời đồ đạc', 'Đường Nguyễn Huệ, Quận 1, Thành Phố Hồ Chí Minh', 10.7681, 106.6503, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 18 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000013', 'C0000000-0000-0000-0000-000000000003', 'tiếp tế', 'Trùng lặp đơn', 'Đường 3/2, Quận 10, Thành Phố Hồ Chí Minh', 10.7681, 106.6503, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 13 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000014', 'C0000000-0000-0000-0000-000000000003', 'khác', 'Hỏi sdt phường', 'Đường Hoàng Văn Thụ, Phú Nhuận, Thành Phố Hồ Chí Minh', 10.7681, 106.6503, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 8 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000015', 'C0000000-0000-0000-0000-000000000003', 'cứu hộ', 'Mái tôn bị tốc', 'Đường Cộng Hòa, Tân Bình, Thành Phố Hồ Chí Minh', 10.7681, 106.6503, 'đang xử lý', 'cao', DATE_SUB(NOW(), INTERVAL 1 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),

-- =======================================================================================
-- Nhóm 2: Người 4, 5, 6 (Mỗi người: 2 Hoàn thành, 2 Hủy, 1 Tạm hoãn)
-- Khu vực dân cư Gò Vấp, Bình Thạnh
-- =======================================================================================
-- Công dân 4 (C0000000...04)
('d0000000-0000-0000-0000-000000000016', 'C0000000-0000-0000-0000-000000000004', 'cứu hộ', 'Cứu hộ chó mèo', 'Đường Âu Cơ, Tân Phú, Thành Phố Hồ Chí Minh', 10.7922, 106.6365, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 24 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000017', 'C0000000-0000-0000-0000-000000000004', 'tiếp tế', 'Nhận thuốc men', 'Đường Nguyễn Văn Linh, Quận 7, Thành Phố Hồ Chí Minh', 10.7290, 106.7220, 'hoàn thành', 'cao', DATE_SUB(NOW(), INTERVAL 20 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000018', 'C0000000-0000-0000-0000-000000000004', 'khác', 'Đã tự giải quyết', 'Đường Huỳnh Tấn Phát, Quận 7, Thành Phố Hồ Chí Minh', 10.7455, 106.7380, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 16 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000019', 'C0000000-0000-0000-0000-000000000004', 'tiếp tế', 'Spam', 'Đường Võ Văn Kiệt, Quận 5, Thành Phố Hồ Chí Minh', 10.7550, 106.6800, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 11 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000020', 'C0000000-0000-0000-0000-000000000004', 'cứu hộ', 'Chờ nước rút để vào', 'Đường Kinh Dương Vương, Bình Tân, Thành Phố Hồ Chí Minh', 10.7420, 106.6150, 'tạm hoãn', 'trung bình', DATE_SUB(NOW(), INTERVAL 1 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000015'),

-- Công dân 5 (C0000000...05)
('d0000000-0000-0000-0000-000000000021', 'C0000000-0000-0000-0000-000000000005', 'tiếp tế', 'Nhận đèn pin', 'Đường Lũy Bán Bích, Tân Phú, Thành Phố Hồ Chí Minh', 10.7865, 106.6320, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 23 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000022', 'C0000000-0000-0000-0000-000000000005', 'cứu hộ', 'Điện giật', 'Đường Trường Chinh, Tân Bình, Thành Phố Hồ Chí Minh', 10.8020, 106.6430, 'hoàn thành', 'cao', DATE_SUB(NOW(), INTERVAL 19 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000023', 'C0000000-0000-0000-0000-000000000005', 'cứu hộ', 'Yêu cầu trùng', 'Đường Quang Trung, Gò Vấp, Thành Phố Hồ Chí Minh', 10.8380, 106.6650, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 15 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000024', 'C0000000-0000-0000-0000-000000000005', 'khác', 'Không rõ thông tin', 'Đường Phan Văn Trị, Gò Vấp, Thành Phố Hồ Chí Minh', 10.8062, 106.7020, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 10 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000025', 'C0000000-0000-0000-0000-000000000005', 'cứu hộ', 'Đường đang kẹt xe chưa vào được', 'Đường Nguyễn Oanh, Gò Vấp, Thành Phố Hồ Chí Minh', 10.8385, 106.6840, 'tạm hoãn', 'trung bình', DATE_SUB(NOW(), INTERVAL 1 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),

-- Công dân 6 (C0000000...06)
('d0000000-0000-0000-0000-000000000026', 'C0000000-0000-0000-0000-000000000006', 'cứu hộ', 'Sơ tán người', 'Đường Đinh Bộ Lĩnh, Bình Thạnh, Thành Phố Hồ Chí Minh', 10.8100, 106.7100, 'hoàn thành', 'cao', DATE_SUB(NOW(), INTERVAL 22 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000040'),
('d0000000-0000-0000-0000-000000000027', 'C0000000-0000-0000-0000-000000000006', 'tiếp tế', 'Cơm hộp', 'Đường Ung Văn Khiêm, Bình Thạnh, Thành Phố Hồ Chí Minh', 10.8060, 106.7150, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 18 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000028', 'C0000000-0000-0000-0000-000000000006', 'khác', 'Báo sai địa chỉ', 'Đường Điện Biên Phủ, Bình Thạnh, Thành Phố Hồ Chí Minh', 10.8010, 106.7105, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 14 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000029', 'C0000000-0000-0000-0000-000000000006', 'tiếp tế', 'Gọi nhầm', 'Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, Thành Phố Hồ Chí Minh', 10.8030, 106.7130, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 9 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000030', 'C0000000-0000-0000-0000-000000000006', 'tiếp tế', 'Hết hàng chờ kho', 'Đường Phạm Văn Đồng, Thủ Đức, Thành Phố Hồ Chí Minh', 10.8230, 106.7200, 'tạm hoãn', 'trung bình', DATE_SUB(NOW(), INTERVAL 1 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),

-- =======================================================================================
-- Nhóm 3: Người 7, 8, 9, 10 (Mỗi người: 2 Tạm hoãn, 2 Hủy, 1 Yêu cầu mới)
-- Khu vực dân cư Quận 7, Quận 8, Bình Tân, Tân Phú
-- =======================================================================================
-- Công dân 7 (C0000000...07)
('d0000000-0000-0000-0000-000000000031', 'C0000000-0000-0000-0000-000000000007', 'tiếp tế', 'Chờ áo phao', 'Đường Đồng Văn Cống, Quận 2, Thành Phố Hồ Chí Minh', 10.7600, 106.7500, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 6 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000032', 'C0000000-0000-0000-0000-000000000007', 'cứu hộ', 'Đợi cứu hộ đến', 'Đường Lương Định Của, Quận 2, Thành Phố Hồ Chí Minh', 10.7800, 106.7400, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 5 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000039'),
('d0000000-0000-0000-0000-000000000033', 'C0000000-0000-0000-0000-000000000007', 'khác', 'Không có thật', 'Đường Trần Não, Quận 2, Thành Phố Hồ Chí Minh', 10.7900, 106.7300, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 20 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000034', 'C0000000-0000-0000-0000-000000000007', 'tiếp tế', 'Không có thật', 'Đường Quốc Hương, Thảo Điền, Thành Phố Hồ Chí Minh', 10.8000, 106.7400, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 15 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000035', 'C0000000-0000-0000-0000-000000000007', 'cứu hộ', 'Nước đang tràn vào', 'Đường Nguyễn Thị Định, Quận 2, Thành Phố Hồ Chí Minh', 10.7550, 106.7700, 'yêu cầu mới', NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL, NULL),

-- Công dân 8 (C0000000...08)
('d0000000-0000-0000-0000-000000000036', 'C0000000-0000-0000-0000-000000000008', 'tiếp tế', 'Chờ nước lọc', 'Đường Kha Vạn Cân, Thủ Đức, Thành Phố Hồ Chí Minh', 10.8450, 106.7560, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 7 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000037', 'C0000000-0000-0000-0000-000000000008', 'cứu hộ', 'Đường chưa thông', 'Đường Linh Trung, Thủ Đức, Thành Phố Hồ Chí Minh', 10.8700, 106.7700, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 4 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000035'),
('d0000000-0000-0000-0000-000000000038', 'C0000000-0000-0000-0000-000000000008', 'cứu hộ', 'Hủy do báo sai', 'Đường Tô Ngọc Vân, Thủ Đức, Thành Phố Hồ Chí Minh', 10.8550, 106.7500, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 21 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000039', 'C0000000-0000-0000-0000-000000000008', 'tiếp tế', 'Không liên lạc được', 'Đường Nguyễn Duy Trinh, Quận 2, Thành Phố Hồ Chí Minh', 10.7700, 106.7700, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 16 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000040', 'C0000000-0000-0000-0000-000000000008', 'cứu hộ', 'Nhà có người ốm', 'Đường Mai Chí Thọ, Quận 2, Thành Phố Hồ Chí Minh', 10.7750, 106.7300, 'yêu cầu mới', NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL, NULL),

-- Công dân 9 (C0000000...09)
('d0000000-0000-0000-0000-000000000041', 'C0000000-0000-0000-0000-000000000009', 'cứu hộ', 'Xe cứu hộ chưa tới', 'Đường Đại lộ Bình Dương, Thủ Dầu Một, Bình Dương', 10.9804, 106.6519, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 8 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000021'),
('d0000000-0000-0000-0000-000000000042', 'C0000000-0000-0000-0000-000000000009', 'tiếp tế', 'Hết bánh mì', 'Đường CMT8, Thủ Dầu Một, Bình Dương', 10.9800, 106.6600, 'hoàn thành', 'thấp', DATE_SUB(NOW(), INTERVAL 3 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000043', 'C0000000-0000-0000-0000-000000000009', 'cứu hộ', 'Test', 'Khu VSIP 1, Thuận An, Bình Dương', 10.9000, 106.7000, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 22 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000044', 'C0000000-0000-0000-0000-000000000009', 'khác', 'Nhầm địa chỉ', 'Khu công nghiệp Sóng Thần, Dĩ An, Bình Dương', 10.8800, 106.7700, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 17 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000045', 'C0000000-0000-0000-0000-000000000009', 'tiếp tế', 'Hết sạch thức ăn', 'Đường DT743, Dĩ An, Bình Dương', 10.8900, 106.7600, 'yêu cầu mới', NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL, NULL),

-- Công dân 10 (C0000000...10)
('d0000000-0000-0000-0000-000000000046', 'C0000000-0000-0000-0000-000000000010', 'cứu hộ', 'Xe cứu hộ chưa tới', 'Khu dân cư Mỹ Phước, Bến Cát, Bình Dương', 11.1500, 106.6000, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 8 HOUR), @CoordinatorId, @RescueTeamId, @vehicleId),
('d0000000-0000-0000-0000-000000000047', 'C0000000-0000-0000-0000-000000000010', 'cứu hộ', 'Mưa quá to không đi được', 'Đường Lê Hồng Phong, Vũng Tàu', 10.4113, 107.1365, 'hoàn thành', 'trung bình', DATE_SUB(NOW(), INTERVAL 2 HOUR), @CoordinatorId, '00000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000027'),
('d0000000-0000-0000-0000-000000000048', 'C0000000-0000-0000-0000-000000000010', 'tiếp tế', 'Trùng người nhận', 'Đường Thùy Vân, Vũng Tàu', 10.4110, 107.1360, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 23 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000049', 'C0000000-0000-0000-0000-000000000010', 'khác', 'Không cần thiết', 'Đường Võ Thị Sáu, Vũng Tàu', 10.4030, 107.1350, 'đã huỷ', NULL, DATE_SUB(NOW(), INTERVAL 18 HOUR), NULL, NULL, NULL),
('d0000000-0000-0000-0000-000000000050', 'C0000000-0000-0000-0000-000000000010', 'cứu hộ', 'Cửa bị kẹt do cây đổ', 'Đường 30/4, Vũng Tàu', 10.3800, 107.1200, 'yêu cầu mới', NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL, NULL);


-- 4. request Images
INSERT INTO RequestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', @ReqActiveId);

INSERT INTO RequestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', @ReqRejectId);

INSERT INTO RequestImage (id, image_url, request_id)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', @ReqCompletedId);

INSERT INTO RequestImage (id, image_url, request_id) VALUES 
-- Công dân 1
('b0000000-0000-0000-0000-000000000001', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000001'), 
('b0000000-0000-0000-0000-000000000002', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000003', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000002'), 
('b0000000-0000-0000-0000-000000000004', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000005', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000006', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000004'),
('b0000000-0000-0000-0000-000000000007', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000005'), 
('b0000000-0000-0000-0000-000000000008', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000005'), 
('b0000000-0000-0000-0000-000000000009', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000005'),

-- Công dân 2
('b0000000-0000-0000-0000-000000000010', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000006'), 
('b0000000-0000-0000-0000-000000000011', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000006'),
('b0000000-0000-0000-0000-000000000012', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000007'), 
('b0000000-0000-0000-0000-000000000013', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000007'),
('b0000000-0000-0000-0000-000000000014', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000008'),
('b0000000-0000-0000-0000-000000000015', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000009'),
('b0000000-0000-0000-0000-000000000016', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000010'), 
('b0000000-0000-0000-0000-000000000017', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000010'), 
('b0000000-0000-0000-0000-000000000018', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000010'),

-- Công dân 3
('b0000000-0000-0000-0000-000000000019', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000011'), 
('b0000000-0000-0000-0000-000000000020', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000011'),
('b0000000-0000-0000-0000-000000000021', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000012'), 
('b0000000-0000-0000-0000-000000000022', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000012'),
('b0000000-0000-0000-0000-000000000023', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000013'),
('b0000000-0000-0000-0000-000000000024', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000014'),
('b0000000-0000-0000-0000-000000000025', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000015'), 
('b0000000-0000-0000-0000-000000000026', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000015'), 
('b0000000-0000-0000-0000-000000000027', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000015'),

-- Công dân 4
('b0000000-0000-0000-0000-000000000028', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000016'), 
('b0000000-0000-0000-0000-000000000029', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000016'),
('b0000000-0000-0000-0000-000000000030', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000017'), 
('b0000000-0000-0000-0000-000000000031', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000017'),
('b0000000-0000-0000-0000-000000000032', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000018'),
('b0000000-0000-0000-0000-000000000033', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000019'),
('b0000000-0000-0000-0000-000000000034', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000020'), 
('b0000000-0000-0000-0000-000000000035', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000020'), 
('b0000000-0000-0000-0000-000000000036', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000020'),

-- Công dân 5
('b0000000-0000-0000-0000-000000000037', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000021'), 
('b0000000-0000-0000-0000-000000000038', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000021'),
('b0000000-0000-0000-0000-000000000039', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000022'), 
('b0000000-0000-0000-0000-000000000040', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000022'),
('b0000000-0000-0000-0000-000000000041', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000023'),
('b0000000-0000-0000-0000-000000000042', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000024'),
('b0000000-0000-0000-0000-000000000043', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000025'), 
('b0000000-0000-0000-0000-000000000044', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000025'), 
('b0000000-0000-0000-0000-000000000045', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000025'),

-- Công dân 6
('b0000000-0000-0000-0000-000000000046', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000026'), 
('b0000000-0000-0000-0000-000000000047', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000026'),
('b0000000-0000-0000-0000-000000000048', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000027'), 
('b0000000-0000-0000-0000-000000000049', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000027'),
('b0000000-0000-0000-0000-000000000050', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000028'),
('b0000000-0000-0000-0000-000000000051', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000029'),
('b0000000-0000-0000-0000-000000000052', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000030'), 
('b0000000-0000-0000-0000-000000000053', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000030'), 
('b0000000-0000-0000-0000-000000000054', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000030'),

-- Công dân 7
('b0000000-0000-0000-0000-000000000055', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000031'), 
('b0000000-0000-0000-0000-000000000056', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000031'),
('b0000000-0000-0000-0000-000000000057', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000032'), 
('b0000000-0000-0000-0000-000000000058', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000032'),
('b0000000-0000-0000-0000-000000000059', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000033'),
('b0000000-0000-0000-0000-000000000060', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000034'),
('b0000000-0000-0000-0000-000000000061', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000035'), 
('b0000000-0000-0000-0000-000000000062', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000035'), 
('b0000000-0000-0000-0000-000000000063', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000035'),

-- Công dân 8
('b0000000-0000-0000-0000-000000000064', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000036'), 
('b0000000-0000-0000-0000-000000000065', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000036'),
('b0000000-0000-0000-0000-000000000066', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000037'), 
('b0000000-0000-0000-0000-000000000067', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000037'),
('b0000000-0000-0000-0000-000000000068', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000038'),
('b0000000-0000-0000-0000-000000000069', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000039'),
('b0000000-0000-0000-0000-000000000070', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000040'), 
('b0000000-0000-0000-0000-000000000071', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000040'), 
('b0000000-0000-0000-0000-000000000072', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000040'),

-- Công dân 9
('b0000000-0000-0000-0000-000000000073', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000041'), 
('b0000000-0000-0000-0000-000000000074', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000041'),
('b0000000-0000-0000-0000-000000000075', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000042'), 
('b0000000-0000-0000-0000-000000000076', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000042'),
('b0000000-0000-0000-0000-000000000077', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000043'),
('b0000000-0000-0000-0000-000000000078', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000044'),
('b0000000-0000-0000-0000-000000000079', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000045'), 
('b0000000-0000-0000-0000-000000000080', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000045'), 
('b0000000-0000-0000-0000-000000000081', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000045'),

-- Công dân 10
('b0000000-0000-0000-0000-000000000082', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000046'), 
('b0000000-0000-0000-0000-000000000083', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000046'),
('b0000000-0000-0000-0000-000000000084', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000047'), 
('b0000000-0000-0000-0000-000000000085', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000047'),
('b0000000-0000-0000-0000-000000000086', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000048'),
('b0000000-0000-0000-0000-000000000087', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000049'),
('b0000000-0000-0000-0000-000000000088', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000050'), 
('b0000000-0000-0000-0000-000000000089', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000050'), 
('b0000000-0000-0000-0000-000000000090', 'https://res.cloudinary.com/diag3tget/image/upload/v1770788331/rescue_requests/sigjy1hfrxo3etiv405c.jpg', 'd0000000-0000-0000-0000-000000000050');


INSERT INTO Message (id, request_id, sender_id, sender_role, content, send_at) VALUES
-- ID từ 1 đến 11 được format chuẩn UUID
('a1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005', @CitizenId, 'người dân', 'Nhà tôi ở hẻm 211 có người già 80 tuổi bị kẹt, nước đang dâng cao quá đầu gối rồi!', DATE_SUB(NOW(), INTERVAL 55 MINUTE)),

('a1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000005', @CoordinatorId, 'điều phối viên', 'Đã tiếp nhận yêu cầu từ hẻm 211 Nguyễn Trãi. Bạn vui lòng giữ bình tĩnh, đội cứu hộ đang chuẩn bị xuất phát.', DATE_SUB(NOW(), INTERVAL 53 MINUTE)),

('a1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000005', @CoordinatorId, 'điều phối viên', 'Cho hỏi nhà mình có mấy tầng? Người già có thể di chuyển lên tầng cao hơn không?', DATE_SUB(NOW(), INTERVAL 50 MINUTE)),

('a1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000005', @CitizenId, 'người dân', 'Nhà cấp 4 thôi ạ, ông cụ đang ngồi trên bàn nhưng nước vẫn đang lên.', DATE_SUB(NOW(), INTERVAL 48 MINUTE)),

('a1000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', @CoordinatorId, 'điều phối viên', 'Đã điều động Đội Cứu Hộ số 5 đến vị trí của bạn. Dự kiến 10 phút nữa sẽ có mặt.', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),

('a1000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000005', @RescueTeamId, 'cứu hộ', 'Đội 5 đang di chuyển qua bùng binh Cộng Hòa, đường hơi ngập sâu nên di chuyển bằng xuồng máy.', DATE_SUB(NOW(), INTERVAL 40 MINUTE)),

('a1000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000005', @RescueTeamId, 'cứu hộ', 'Đã vào đầu hẻm 211, nhà mình số bao nhiêu hoặc có dấu hiệu nhận biết gì không?', DATE_SUB(NOW(), INTERVAL 35 MINUTE)),

('a1000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000005', @CitizenId, 'người dân', 'Nhà tôi có treo cờ Tổ quốc trước cửa, cạnh cây cột điện lớn nhé!', DATE_SUB(NOW(), INTERVAL 33 MINUTE)),

('a1000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000005', @RescueTeamId, 'cứu hộ', 'Đã thấy nhà treo cờ. Đang tiếp cận để đưa cụ ông ra ngoài.', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),

('a1000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000005', @RescueTeamId, 'cứu hộ', 'Báo cáo: Đã đưa được cụ ông và 1 người nhà ra xuồng. Tình trạng sức khỏe ổn định, đang đưa về trạm y tế phường.', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),

('a1000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000005', @CoordinatorId, 'điều phối viên', 'Tuyệt vời. Đội 5 tiếp tục hỗ trợ các hộ lân cận trong hẻm nhé. Yêu cầu đã hoàn tất.', DATE_SUB(NOW(), INTERVAL 10 MINUTE));

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
    s_team.id as rescue_team_id,
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

SELECT s.team_name, COUNT(v.id) as total_vehicles
FROM Staff s
JOIN Vehicle v ON s.id = v.rescue_team_id
GROUP BY s.id;

SELECT type, state, COUNT(*) as quantity 
FROM Vehicle 
GROUP BY type, state;
UPDATE Staff SET staff_state = "không hoạt động" where id = "00000000-0000-0000-0000-000000000006";

SELECT * FROM Staff;
SELECT * FROM Request ;
SELECT * FROM Citizen;
SELECT * FROM RequestImage;