package com.rescue.backend.model.bean;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Staff")
@Getter
@Setter
@NoArgsConstructor
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 30, unique = true)
    private String phone;

    @Column(nullable = false)
    private String password;

    // SỬA: Đảm bảo trùng khớp với ENUM tiếng Việt trong DB
    @Column(nullable = false, length = 20)
    private String role; // "quản lý", "điều phối viên", "cứu hộ"

    @Column(name = "team_name", length = 50)
    private String teamName;

    @Column(name = "team_size")
    private Integer teamSize;

    @Column(precision = 18, scale = 10)
    private BigDecimal latitude;

    @Column(precision = 18, scale = 10)
    private BigDecimal longitude;

    // SỬA QUAN TRỌNG: Đổi geography thành POINT (phù hợp với MySQL)
    @Column(name = "geo_location",
            columnDefinition = "POINT",
            insertable = false,
            updatable = false)
    private Point geoLocation;

    @Column(name = "staff_state")
    private String staffState = "ngoại tuyến"; // Cập nhật mặc định tiếng Việt

    @OneToMany(mappedBy = "staff")
    private List<Vehicle> vehicles;

    // Staff đóng vai trò Coordinator
    @OneToMany(mappedBy = "coordinator")
    private List<Request> coordinatedRequests;

    @OneToMany(mappedBy = "rescueTeam")
    private List<Request> assignedTasks;

    @OneToMany(mappedBy = "senderStaff")
    private List<Message> messages;
}