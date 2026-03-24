USE master;
GO
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'FloodRescueCoordination')
BEGIN
    ALTER DATABASE FloodRescueCoordination SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE FloodRescueCoordination;
END
GO

CREATE DATABASE FloodRescueCoordination;
GO

USE FloodRescueCoordination;
GO



-- 1. BẢNG Citizen (Công dân - Thay thế cho [User])
CREATE TABLE Citizen (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL 
);

-- 2. BẢNG Staff (Cán bộ / Đội cứu hộ)
CREATE TABLE Staff (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Độ dài 255 để chứa BCrypt bảo mật
    role VARCHAR(20) NOT NULL,
    team_name NVARCHAR(50),
    team_size INT,
    latitude DECIMAL(18, 10),
    longitude DECIMAL(18, 10),
    geo_location GEOGRAPHY,
    staff_state VARCHAR(20) DEFAULT 'offline',

    CONSTRAINT CK_Staff_Role CHECK (role IN ('rescue manager', 'rescue coordinator', 'rescue team')),
    CONSTRAINT CK_Staff_State CHECK (staff_state IN ('active', 'offline'))
);

-- 3. BẢNG Vehicle (Phương tiện)
CREATE TABLE Vehicle (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    type VARCHAR(30) NOT NULL,
    rescue_team_id UNIQUEIDENTIFIER NOT NULL,
    state VARCHAR(20) DEFAULT 'free',

    FOREIGN KEY (rescue_team_id) REFERENCES Staff(id),

    CONSTRAINT CK_Vehicle_Type CHECK (type IN ('Boat', 'Rescue Vehicle', 'Helicopter')),
    CONSTRAINT CK_Vehicle_State CHECK (state IN ('using', 'free', 'maintenance'))
);

-- 4. BẢNG Request (Yêu cầu cứu hộ - Đã gộp Assignment)
CREATE TABLE Request (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- FK tới bảng Citizen
    type VARCHAR(20) NOT NULL,
    description NVARCHAR(MAX),
    address NVARCHAR(200),
    latitude DECIMAL(18, 10) NOT NULL,
    longitude DECIMAL(18, 10) NOT NULL,
    geo_location GEOGRAPHY NULL,
    additional_link NVARCHAR(200),
    status VARCHAR(20) DEFAULT 'processing',
    urgency VARCHAR(20) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    
    -- Các trường điều phối và xử lý trực tiếp
    coordinator_id UNIQUEIDENTIFIER NULL,
    rescue_team_id UNIQUEIDENTIFIER NULL,
    vehicle_id UNIQUEIDENTIFIER NULL,
    report NVARCHAR(MAX) NULL,

    FOREIGN KEY (user_id) REFERENCES Citizen(id) ON DELETE CASCADE,
    FOREIGN KEY (coordinator_id) REFERENCES Staff(id),
    FOREIGN KEY (rescue_team_id) REFERENCES Staff(id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id),
    
    CONSTRAINT CK_Request_Type CHECK (type IN ('goods', 'rescue', 'others')),
    CONSTRAINT CK_Request_Status CHECK (status IN ('processing', 'reject', 'delayed', 'completed', 'accept')),
    CONSTRAINT CK_Request_Urgency CHECK (urgency IN ('high', 'medium', 'low'))
);

-- 5. BẢNG RequestImage (Ảnh đính kèm)
CREATE TABLE RequestImage (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    request_id UNIQUEIDENTIFIER NOT NULL,
    image_url NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (request_id) REFERENCES Request(id) ON DELETE CASCADE
);

-- 6. BẢNG Message (Trao đổi trực tuyến)
CREATE TABLE Message (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    request_id UNIQUEIDENTIFIER NOT NULL,
    sender_user_id UNIQUEIDENTIFIER NULL, -- FK tới Citizen (nếu người gửi là công dân)
    sender_staff_id UNIQUEIDENTIFIER NULL, -- FK tới Staff (nếu người gửi là nhân viên)
    sender_role VARCHAR(20) NOT NULL,
    content NVARCHAR(MAX),
    send_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (request_id) REFERENCES Request(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES Citizen(id),
    FOREIGN KEY (sender_staff_id) REFERENCES Staff(id),
    CONSTRAINT CK_Message_SenderRole CHECK (sender_role IN ('user', 'coordinator', 'rescue team'))
);
GO

-- 7. TRIGGER TỰ ĐỘNG CẬP NHẬT TỌA ĐỘ SPATIAL CHO REQUEST
GO
CREATE OR ALTER TRIGGER TRG_UpdateGeography_Request ON Request AFTER INSERT, UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE r 
    SET r.geo_location = CASE 
        WHEN i.latitude IS NOT NULL AND i.longitude IS NOT NULL 
        THEN geography::Point(CAST(i.latitude AS FLOAT), CAST(i.longitude AS FLOAT), 4326) 
        ELSE r.geo_location 
    END
    FROM Request r 
    INNER JOIN inserted i ON r.id = i.id;
END;
GO

CREATE OR ALTER TRIGGER TRG_UpdateGeography_Staff ON Staff AFTER INSERT, UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE s 
    SET s.geo_location = CASE 
        WHEN i.latitude IS NOT NULL AND i.longitude IS NOT NULL 
        THEN geography::Point(CAST(i.latitude AS FLOAT), CAST(i.longitude AS FLOAT), 4326) 
        ELSE s.geo_location 
    END
    FROM Staff s 
    INNER JOIN inserted i ON s.id = i.id;
END;
GO

-- ==========================================================
-- 1. CHUẨN BỊ TÀI KHOẢN (NHÂN VIÊN ĐIỀU PHỐI & ĐỘI CỨU HỘ)
-- ==========================================================
DECLARE @CoordinatorId UNIQUEIDENTIFIER = NEWID();
DECLARE @RescueTeamId UNIQUEIDENTIFIER = NEWID();
DECLARE @VehicleId UNIQUEIDENTIFIER = NEWID();

-- Nhân viên 1: Điều phối viên
INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@CoordinatorId, N'Lê Quản Lý', '0123456789', '$2a$10$.u3JhU9mJlUKllKBVBa/uOyesNsIKAsyTT.tR7EeVYkyW6r03K6.a', 'rescue coordinator', 'active');

-- Nhân viên 2: Đội trưởng đội cứu hộ Cá Heo
INSERT INTO Staff (id, name, phone, password, role, team_name, team_size, staff_state)
VALUES (@RescueTeamId, N'Đội Trưởng Hùng', '0988888888', '$2a$10$CfagTyiPN10qeaKEOmuDvOVnImsqfEY87zCMbttgkld.OZU771jJe', 'rescue team', N'Biệt đội Cá Heo', 5, 'active');

-- Phương tiện cho Đội Cá Heo
INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@VehicleId, 'Boat', @RescueTeamId, 'using');

-- ==========================================================
-- 2. TẠO THÊM TÀI KHOẢN MỚI (Cặp số 2)
-- ==========================================================
DECLARE @Coordinator2Id UNIQUEIDENTIFIER = NEWID();
DECLARE @RescueTeam2Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Vehicle2Id UNIQUEIDENTIFIER = NEWID();

-- Nhân viên 3: Điều phối viên số 2
INSERT INTO Staff (id, name, phone, password, role, staff_state)
VALUES (@Coordinator2Id, N'Nguyễn Điều Phối', '0911222333', '$2a$10$4oChkN0c9sIiEue5AuMhyOU6SvnZBQqzktLDN0qoYJCrtOHd.I2te', 'rescue coordinator', 'active');

-- Nhân viên 4: Đội Cứu Hộ Sao Vàng
INSERT INTO Staff (id, name, phone, password, role, team_name, team_size, staff_state)
VALUES (@RescueTeam2Id, N'Đội Cứu Hộ Sao Vàng', '0944555666', '$2a$10$YiYDeWsGcnXVP5VFKFDbROUvjJFPwvkfFjLr/9BVERnH3c4Vy6sXC', 'rescue team', N'Sao Vàng Team', 8, 'active');

-- Phương tiện cho Đội Sao Vàng
INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@Vehicle2Id, 'Rescue Vehicle', @RescueTeam2Id, 'free');


-- ==========================================================
-- 3. TẠO CÔNG DÂN
-- ==========================================================
DECLARE @CitizenId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Citizen (id, name, phone) 
VALUES (@CitizenId, N'Nguyễn Văn Dân', '0912345678');

-- ==========================================================
-- 4. TẠO YÊU CẦU CỨU HỘ (Gộp trực tiếp thông tin phân công)
-- ==========================================================

-- YÊU CẦU 1: ĐÃ HOÀN THÀNH (Dữ liệu phân công nằm ngay tại bảng Request)
DECLARE @ReqCompletedId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqCompletedId, @CitizenId, 'rescue', N'Cần sơ tán khẩn cấp (Đã xong)', N'789 Đường ven đê', 10.7890, 106.7890, 
        'completed', 'high', DATEADD(HOUR, -2, GETDATE()), @Coordinator2Id, @RescueTeam2Id, @Vehicle2Id, N'Đã hoàn thành việc sơ tán 5 người già và 2 trẻ em an toàn.');

-- YÊU CẦU 2: BỊ TỪ CHỐI
DECLARE @ReqRejectId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at)
VALUES (@ReqRejectId, @CitizenId, 'goods', N'Cần hỗ trợ lương thực (Bị từ chối)', N'456 Đường Hẻm Sâu', 10.5678, 106.5678, 
        'reject', 'medium', DATEADD(HOUR, -1, GETDATE()));
-- YÊU CẦU 3: ĐANG XỬ LÝ (Gán cho Đội Cá Heo)
DECLARE @ReqActiveId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at, coordinator_id, rescue_team_id, vehicle_id, report)
VALUES (@ReqActiveId, @CitizenId, 'rescue', N'Nước đang dâng cao, cần xuồng gấp (Mới nhất)', N'123 Đường ven sông', 10.1234, 106.1234, 
        'accept', 'high', GETDATE(), @CoordinatorId, @RescueTeamId, @VehicleId, N'Đang di chuyển tiếp cận hiện trường');

-- ==========================================================
-- 5. THÊM HÌNH ẢNH
-- ==========================================================
INSERT INTO RequestImage (id, image_url, request_id)
VALUES (NEWID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqActiveId);
INSERT INTO RequestImage (id, image_url, request_id)
VALUES (NEWID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqRejectId);
INSERT INTO RequestImage (id, image_url, request_id)
VALUES (NEWID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqCompletedId);


-- KIỂM TRA DỮ LIỆU CHI TIẾT YÊU CẦU

SELECT
    r.id AS [requestId],
    r.address AS [address],
    r.description AS [description],
    r.additional_link AS [additionalLink],
    FORMAT(r.created_at, 'yyyy-MM-ddTHH:mm:ss') AS [createdAt],
    r.latitude AS [latitude],
    r.longitude AS [longitude],
    r.status AS [status],
    r.type AS [type],
    r.urgency AS [urgency],
    r.report AS [rescueReport], -- Cột report mới nằm trong Request
    c.id AS [citizenId],
    c.name AS [citizenName],
    c.phone AS [citizenPhone],
    -- Lấy thông tin người điều phối trực tiếp từ Request -> Staff
    s_coord.name AS [coordinatorName],
    -- Lấy tên đội trưởng đội cứu hộ từ Request -> Staff
    s_team.name AS [rescueLeaderName],
    s_team.team_name AS [teamName],
    -- Lấy loại phương tiện trực tiếp từ Request -> Vehicle
    v.type AS [vehicleType],
    -- Subquery lấy danh sách ảnh
    (
        SELECT 
            ri.id AS [id],
            ri.image_url AS [imageUrl]
        FROM RequestImage ri
        WHERE ri.request_id = r.id
        FOR JSON PATH
    ) AS [images]

FROM Request r
INNER JOIN Citizen c ON r.user_id = c.id
LEFT JOIN Staff s_coord ON r.coordinator_id = s_coord.id -- Join trực tiếp vào Staff
LEFT JOIN Staff s_team ON r.rescue_team_id = s_team.id   -- Join trực tiếp vào Staff
LEFT JOIN Vehicle v ON r.vehicle_id = v.id              -- Join trực tiếp vào Vehicle
WHERE c.phone = '0912345678'
ORDER BY r.created_at DESC;
-- Xem tất cả nhân viên (Manager, Coordinator, Rescue Team)

SELECT * FROM Staff;
