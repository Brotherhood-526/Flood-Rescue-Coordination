DROP DATABASE IF EXISTS FloodRescueCoordination
GO
CREATE DATABASE FloodRescueCoordination
GO

CREATE TABLE Citizen (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL 
);

CREATE TABLE Account (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    team_name NVARCHAR(50),
    team_size INT,
    latitude DECIMAL(18, 10),
    longitude DECIMAL(18, 10),
    
    account_state VARCHAR(20) DEFAULT 'offline',

    CONSTRAINT CK_Account_Role CHECK (role IN ('manager', 'rescue coordinator', 'rescue team')),
    CONSTRAINT CK_Account_State CHECK (account_state IN ('active', 'offline'))
);

CREATE TABLE Request (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- Giữ nguyên tên cột user_id để đỡ sửa nhiều code Java, hoặc đổi thành citizen_id nếu muốn
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

    FOREIGN KEY (user_id) REFERENCES Citizen(id) ON DELETE CASCADE,
    
    CONSTRAINT CK_Request_Type CHECK (type IN ('goods', 'rescue', 'others')),
    CONSTRAINT CK_Request_Status CHECK (status IN ('processing', 'reject', 'delayed', 'accept', 'completed')),
    CONSTRAINT CK_Request_Urgency CHECK (urgency IN ('high', 'medium', 'low'))
);

CREATE TABLE RequestImage (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    image_url NVARCHAR(MAX) NOT NULL,
    request_id UNIQUEIDENTIFIER NOT NULL,

    FOREIGN KEY (request_id) REFERENCES Request(id) ON DELETE CASCADE
);

CREATE TABLE Vehicle (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    type VARCHAR(30) NOT NULL,
    rescue_team_id UNIQUEIDENTIFIER NOT NULL,
    state VARCHAR(20) DEFAULT 'free',

    FOREIGN KEY (rescue_team_id) REFERENCES Account(id),

    CONSTRAINT CK_Vehicle_Type CHECK (type IN ('Boat', 'Rescue Vehicle', 'Helicopter')),
    CONSTRAINT CK_Vehicle_State CHECK (state IN ('using', 'free', 'maintenance'))
);

CREATE TABLE RescueTeamAssignment (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    request_id UNIQUEIDENTIFIER NOT NULL,
    coordinator_id UNIQUEIDENTIFIER NOT NULL,
    rescue_team_id UNIQUEIDENTIFIER NOT NULL,
    vehicle_id UNIQUEIDENTIFIER NOT NULL,
    status VARCHAR(20) DEFAULT 'on the way',
    report NVARCHAR(MAX),

    FOREIGN KEY (request_id) REFERENCES Request(id),
    FOREIGN KEY (coordinator_id) REFERENCES Account(id),
    FOREIGN KEY (rescue_team_id) REFERENCES Account(id),

    CONSTRAINT CK_Assignment_Status CHECK (status IN ('on the way', 'completed', 'delayed'))
);

CREATE TABLE Message (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    request_id UNIQUEIDENTIFIER NOT NULL,
    sender_id UNIQUEIDENTIFIER NOT NULL,
    sender_role VARCHAR(20) NOT NULL,
    content NVARCHAR(MAX),
    send_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (request_id) REFERENCES Request(id),

    CONSTRAINT CK_Message_SenderRole CHECK (sender_role IN ('citizen', 'coordinator', 'rescue team'))
);
GO

/*
CREATE INDEX IX_Citizen_Phone ON Citizen(phone); 
CREATE INDEX IX_Request_UserId ON Request(user_id);
CREATE INDEX IX_Message_RequestId ON Message(request_id, send_at DESC);
CREATE INDEX IX_RequestImage_RequestId ON RequestImage(request_id);

CREATE INDEX IX_Request_Status_Created ON Request(status, created_at DESC);
CREATE SPATIAL INDEX SP_IX_Request_GeoLocation ON Request(geo_location);
CREATE SPATIAL INDEX SP_IX_Account_GeoLocation ON Account(geo_location);
CREATE INDEX IX_Account_Role_State ON Account(role, account_state) INCLUDE (name, phone, team_name, team_size);

CREATE INDEX IX_Assignment_Team_Status ON RescueTeamAssignment(account_id, status) INCLUDE (request_id);
CREATE INDEX IX_Assignment_Request_Lookup ON RescueTeamAssignment(request_id);

CREATE INDEX IX_Request_Stats_Covering ON Request(status);
CREATE INDEX IX_Assignment_Stats ON Request(address);
CREATE INDEX IX_Vehicle_State_Type_Owner ON Vehicle(state, type) INCLUDE (rescue_team_id);


-- 1. Xóa Index trên bảng Citizen
DROP INDEX IF EXISTS IX_Citizen_Phone ON Citizen;

-- 2. Xóa Index trên bảng Request
DROP INDEX IF EXISTS IX_Request_UserId ON Request;
DROP INDEX IF EXISTS IX_Request_Status_Created ON Request;
DROP INDEX IF EXISTS SP_IX_Request_GeoLocation ON Request; -- Spatial Index
DROP INDEX IF EXISTS IX_Request_Stats_Covering ON Request;
DROP INDEX IF EXISTS IX_Assignment_Stats ON Request;

-- 3. Xóa Index trên bảng Message
DROP INDEX IF EXISTS IX_Message_RequestId ON Message;

-- 4. Xóa Index trên bảng RequestImage
DROP INDEX IF EXISTS IX_RequestImage_RequestId ON RequestImage;

-- 5. Xóa Index trên bảng Account
DROP INDEX IF EXISTS SP_IX_Account_GeoLocation ON Account; -- Spatial Index
DROP INDEX IF EXISTS IX_Account_Role_State ON Account;

-- 6. Xóa Index trên bảng RescueTeamAssignment
DROP INDEX IF EXISTS IX_Assignment_Team_Status ON RescueTeamAssignment;
DROP INDEX IF EXISTS IX_Assignment_Request_Lookup ON RescueTeamAssignment;

-- 7. Xóa Index trên bảng Vehicle
DROP INDEX IF EXISTS IX_Vehicle_State_Type_Owner ON Vehicle;
*/



/*
SELECT * FROM sys.spatial_reference_systems WHERE spatial_reference_id = 4326;
GO

ALTER TABLE Request ALTER COLUMN geo_location GEOGRAPHY NULL;
GO

SELECT COLUMN_NAME, DATA_TYPE, NUMERIC_PRECISION, NUMERIC_SCALE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Request' AND COLUMN_NAME IN ('latitude', 'longitude');

SELECT * FRom dbo.Citizen
SELECT * FROM Request ORDER BY created_at
SELECT id, address, geo_location.STAsText() as WKT FROM Request;
SELECT * FROM RequestImage
GO

CREATE TRIGGER TRG_UpdateGeography
ON Request
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE r
    SET r.geo_location = geography::Point(i.latitude, i.longitude, 4326)
    FROM Request r
    INNER JOIN inserted i ON r.id = i.id
    WHERE i.latitude IS NOT NULL AND i.longitude IS NOT NULL;
END;


DROP TRIGGER IF EXISTS TRG_UpdateGeography
*/
SELECT 
    name AS [Object Name], 
    type_desc AS [Object Type], 
    create_date AS [Date Created]
FROM sys.objects
WHERE type IN ('V', 'P', 'FN', 'TF', 'IF', 'TR') -- V: View, P: Procedure, FN/TF/IF: Functions
ORDER BY type_desc, name;
GO

-- ==========================================================
-- 1. CHUẨN BỊ TÀI KHOẢN (ĐIỀU PHỐI & ĐỘI CỨU HỘ)
-- ==========================================================
DECLARE @CoordinatorId UNIQUEIDENTIFIER = NEWID();
DECLARE @RescueTeamId UNIQUEIDENTIFIER = NEWID();
DECLARE @VehicleId UNIQUEIDENTIFIER = NEWID();

INSERT INTO Account (id, name, phone, password, role, account_state)
VALUES (@CoordinatorId, N'Lê Quản Lý', '0123456789', 'password123', 'rescue coordinator', 'active');

INSERT INTO Account (id, name, phone, password, role, team_name, team_size, account_state)
VALUES (@RescueTeamId, N'Đội Trưởng Hùng', '0988888888', 'password123', 'rescue team', N'Biệt đội Cá Heo', 5, 'active');

INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@VehicleId, 'Boat', @RescueTeamId, 'using');

-- ==========================================================
-- 1. TẠO THÊM TÀI KHOẢN MỚI (Cặp số 2)
-- ==========================================================
DECLARE @Coordinator2Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Vehicle2Id UNIQUEIDENTIFIER = NEWID();
DECLARE @RescueTeam2Id UNIQUEIDENTIFIER = NEWID();


-- Tạo Điều phối viên số 2
INSERT INTO Account (id, name, phone, password, role, account_state)
VALUES (@Coordinator2Id, N'Nguyễn Điều Phối', '0911222333', 'pass456', 'rescue coordinator', 'active');

-- Tạo Đội cứu hộ số 2
INSERT INTO Account (id, name, phone, password, role, team_name, team_size, account_state)
VALUES (@RescueTeam2Id, N'Đội Cứu Hộ Sao Vàng', '0944555666', 'pass456', 'rescue team', N'Sao Vàng Team', 8, 'active');

-- Tạo Phương tiện cho Đội 2

INSERT INTO Vehicle (id, type, rescue_team_id, state)
VALUES (@Vehicle2Id, 'Rescue Vehicle', @RescueTeam2Id, 'free');


-- ==========================================================
-- 2. TẠO 1 CÔNG DÂN DUY NHẤT VỚI SỐ ĐIỆN THOẠI TEST
-- ==========================================================
DECLARE @CitizenId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Citizen (id, name, phone) 
VALUES (@CitizenId, N'Nguyễn Văn Dân', '0912345678');

-- ==========================================================
-- 3. TẠO 3 YÊU CẦU CỨU HỘ VỚI THỜI GIAN KHÁC NHAU
-- ==========================================================

-- YÊU CẦU 1: ĐÃ HOÀN THÀNH (Quá khứ - 2 tiếng trước)
DECLARE @ReqCompletedId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at)
VALUES (@ReqCompletedId, @CitizenId, 'rescue', N'Cần sơ tán khẩn cấp (Đã xong)', N'789 Đường ven đê', 10.7890, 106.7890, 
        'completed', 'high', DATEADD(HOUR, -2, GETDATE()));

-- YÊU CẦU 2: BỊ TỪ CHỐI (1 tiếng trước)
DECLARE @ReqRejectId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at)
VALUES (@ReqRejectId, @CitizenId, 'goods', N'Cần hỗ trợ lương thực (Bị từ chối)', N'456 Đường Hẻm Sâu', 10.5678, 106.5678, 
        'reject', 'medium', DATEADD(HOUR, -1, GETDATE()));

-- YÊU CẦU 3: ĐANG XỬ LÝ (Mới nhất - Vừa xong)
DECLARE @ReqActiveId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Request (id, user_id, type, description, address, latitude, longitude, status, urgency, created_at)
VALUES (@ReqActiveId, @CitizenId, 'rescue', N'Nước đang dâng cao, cần xuồng gấp (Mới nhất)', N'123 Đường ven sông', 10.1234, 106.1234, 
        'accept', 'high', GETDATE());



-- ==========================================================
-- 4. THÊM HÌNH ẢNH VÀ PHÂN CÔNG CHO YÊU CẦU MỚI NHẤT
-- ==========================================================
INSERT INTO RequestImage (id, image_url, request_id)
VALUES (NEWID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqActiveId);

INSERT INTO RequestImage (id, image_url, request_id)
VALUES (NEWID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqRejectId);
INSERT INTO RequestImage (id, image_url, request_id)
VALUES (NEWID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqCompletedId);

INSERT INTO RescueTeamAssignment (request_id, coordinator_id, rescue_team_id, vehicle_id, status, report)
VALUES (@ReqActiveId, @CoordinatorId, @RescueTeamId, @VehicleId, 'on the way', N'Đang di chuyển tiếp cận hiện trường');

INSERT INTO RescueTeamAssignment (request_id, coordinator_id, rescue_team_id, vehicle_id, status, report)
VALUES (
    @ReqCompletedId, 
    @Coordinator2Id, 
    @RescueTeam2Id, 
    @Vehicle2Id, 
    'completed', -- Trạng thái phân công cũng để là completed
    N'Đã hoàn thành việc sơ tán 5 người già và 2 trẻ em an toàn.'
);

-- KIỂM TRA DỮ LIỆU PHÂN CÔNG
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
    c.id AS [citizenId],
    c.name AS [citizenName],
    c.phone AS [citizenPhone],
    
    -- Lấy thông tin người điều phối từ bảng Account thông qua coordinator_id
    acc_coord.name AS [coordinatorName],
    
    -- Lấy tên đội trưởng (hoặc tên đội) từ bảng Account thông qua rescue_team_id
    acc_team.name AS [rescueLeaderName],
    
    -- Lấy loại phương tiện từ bảng Vehicle
    v.type AS [vehicle],

    -- Subquery lấy danh sách ảnh theo định dạng của LookupImageResponse
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
LEFT JOIN RescueTeamAssignment rta ON r.id = rta.request_id
LEFT JOIN Account acc_coord ON rta.coordinator_id = acc_coord.id
LEFT JOIN Account acc_team ON rta.rescue_team_id = acc_team.id
LEFT JOIN Vehicle v ON rta.vehicle_id = v.id
WHERE c.phone = '0912345678'
ORDER BY r.created_at DESC

    
/*
SELECT * FROM Citizen c
JOIN Request r ON c.id = r.user_id
WHERE r.status IN ('processing', 'delayed')
AND c.phone = '0912345678'


DELETE FROM Message;
DELETE FROM RescueTeamAssignment;
DELETE FROM RequestImage;
DELETE FROM Vehicle;
DELETE FROM Request;
DELETE FROM Account;
DELETE FROM Citizen;

DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS RescueTeamAssignment;
DROP TABLE IF EXISTS RequestImage;
DROP TABLE IF EXISTS Vehicle;
DROP TABLE IF EXISTS Request;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Citizen;
GO

*/