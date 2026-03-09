-- ==========================================================
-- Seed data for MySQL schema (converted from old.sql)
-- ==========================================================

-- ==========================================================
-- 1. CHUAN BI TAI KHOAN (DIEU PHOI & DOI CUU HO)
-- ==========================================================
SET @CoordinatorId = UUID();
SET @RescueTeamId = UUID();
SET @VehicleId = UUID();

INSERT INTO `Account` (`id`, `name`, `phone`, `password`, `role`, `account_state`)
VALUES (@CoordinatorId, 'Lê Quản Lý', '0123456789', 'password123', 'rescue coordinator', 'active');

INSERT INTO `Account` (`id`, `name`, `phone`, `password`, `role`, `team_name`, `team_size`, `account_state`)
VALUES (@RescueTeamId, 'Đội Trưởng Hùng', '0988888888', 'password123', 'rescue team', 'Biệt đội Cá Heo', 5, 'active');

INSERT INTO `Vehicle` (`id`, `type`, `rescue_team_id`, `state`)
VALUES (@VehicleId, 'Boat', @RescueTeamId, 'using');

-- ==========================================================
-- 2. TAO THEM TAI KHOAN MOI (Cap so 2)
-- ==========================================================
SET @Coordinator2Id = UUID();
SET @Vehicle2Id = UUID();
SET @RescueTeam2Id = UUID();

INSERT INTO `Account` (`id`, `name`, `phone`, `password`, `role`, `account_state`)
VALUES (@Coordinator2Id, 'Nguyễn Điều Phối', '0911222333', 'pass456', 'rescue coordinator', 'active');

INSERT INTO `Account` (`id`, `name`, `phone`, `password`, `role`, `team_name`, `team_size`, `account_state`)
VALUES (@RescueTeam2Id, 'Đội Cứu Hộ Sao Vàng', '0944555666', 'pass456', 'rescue team', 'Sao Vàng Team', 8, 'active');

INSERT INTO `Vehicle` (`id`, `type`, `rescue_team_id`, `state`)
VALUES (@Vehicle2Id, 'Rescue Vehicle', @RescueTeam2Id, 'free');

-- ==========================================================
-- 3. TAO 1 CONG DAN DUY NHAT VOI SO DIEN THOAI TEST
-- ==========================================================
SET @CitizenId = UUID();

INSERT INTO `Citizen` (`id`, `name`, `phone`)
VALUES (@CitizenId, 'Nguyễn Văn Dân', '0912345678');

-- ==========================================================
-- 4. TAO 3 YEU CAU CUU HO VOI THOI GIAN KHAC NHAU
-- ==========================================================
SET @ReqCompletedId = UUID();
INSERT INTO `Request` (`id`, `user_id`, `type`, `description`, `address`, `latitude`, `longitude`, `status`, `urgency`, `created_at`)
VALUES (@ReqCompletedId, @CitizenId, 'rescue', 'Cần sơ tán khẩn cấp (Đã xong)', '789 Đường ven đê', 10.7890, 106.7890,
        'completed', 'high', DATE_SUB(NOW(), INTERVAL 2 HOUR));

SET @ReqRejectId = UUID();
INSERT INTO `Request` (`id`, `user_id`, `type`, `description`, `address`, `latitude`, `longitude`, `status`, `urgency`, `created_at`)
VALUES (@ReqRejectId, @CitizenId, 'goods', 'Cần hỗ trợ lương thực (Bị từ chối)', '456 Đường Hẻm Sâu', 10.5678, 106.5678,
        'reject', 'medium', DATE_SUB(NOW(), INTERVAL 1 HOUR));

SET @ReqActiveId = UUID();
INSERT INTO `Request` (`id`, `user_id`, `type`, `description`, `address`, `latitude`, `longitude`, `status`, `urgency`, `created_at`)
VALUES (@ReqActiveId, @CitizenId, 'rescue', 'Nước đang dâng cao, cần xuồng gấp (Mới nhất)', '123 Đường ven sông', 10.1234, 106.1234,
        'accept', 'high', NOW());

-- ==========================================================
-- 5. THEM HINH ANH VA PHAN CONG CHO YEU CAU
-- ==========================================================
INSERT INTO `RequestImage` (`id`, `image_url`, `request_id`)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqActiveId);

INSERT INTO `RequestImage` (`id`, `image_url`, `request_id`)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqRejectId);

INSERT INTO `RequestImage` (`id`, `image_url`, `request_id`)
VALUES (UUID(), 'https://res.cloudinary.com/diag3tget/image/upload/v1770796864/rescue_requests/uquxkzzyxwomaohcqp8s.jpg', @ReqCompletedId);

SET @AssignmentActiveId = UUID();
INSERT INTO `RescueTeamAssignment` (`id`, `request_id`, `coordinator_id`, `rescue_team_id`, `vehicle_id`, `status`, `report`)
VALUES (@AssignmentActiveId, @ReqActiveId, @CoordinatorId, @RescueTeamId, @VehicleId, 'on the way', 'Đang di chuyển tiếp cận hiện trường');

SET @AssignmentCompletedId = UUID();
INSERT INTO `RescueTeamAssignment` (`id`, `request_id`, `coordinator_id`, `rescue_team_id`, `vehicle_id`, `status`, `report`)
VALUES (@AssignmentCompletedId, @ReqCompletedId, @Coordinator2Id, @RescueTeam2Id, @Vehicle2Id, 'completed',
        'Đã hoàn thành việc sơ tán 5 người già và 2 trẻ em an toàn.');

-- KIEM TRA DU LIEU PHAN CONG
SELECT
    r.`id` AS `requestId`,
    r.`address` AS `address`,
    r.`description` AS `description`,
    r.`additional_link` AS `additionalLink`,
    DATE_FORMAT(r.`created_at`, '%Y-%m-%dT%H:%i:%s') AS `createdAt`,
    r.`latitude` AS `latitude`,
    r.`longitude` AS `longitude`,
    r.`status` AS `status`,
    r.`type` AS `type`,
    r.`urgency` AS `urgency`,
    c.`id` AS `citizenId`,
    c.`name` AS `citizenName`,
    c.`phone` AS `citizenPhone`,
    acc_coord.`name` AS `coordinatorName`,
    acc_team.`name` AS `rescueLeaderName`,
    v.`type` AS `vehicle`,
    (
        SELECT COALESCE(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', ri.`id`,
                    'imageUrl', ri.`image_url`
                )
            ),
            JSON_ARRAY()
        )
        FROM `RequestImage` ri
        WHERE ri.`request_id` = r.`id`
    ) AS `images`
FROM `Request` r
INNER JOIN `Citizen` c ON r.`user_id` = c.`id`
LEFT JOIN `RescueTeamAssignment` rta ON r.`id` = rta.`request_id`
LEFT JOIN `Account` acc_coord ON rta.`coordinator_id` = acc_coord.`id`
LEFT JOIN `Account` acc_team ON rta.`rescue_team_id` = acc_team.`id`
LEFT JOIN `Vehicle` v ON rta.`vehicle_id` = v.`id`
WHERE c.`phone` = '0912345678'
ORDER BY r.`created_at` DESC;
