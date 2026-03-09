package com.rescue.backend.model.bean;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 30, unique = true)
    private String phone;

    @Column(length = 255)
    private String password;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(length = 255, name = "team_name")
    private String teamName;

    @Column(name = "team_size")
    private Integer teamSize;

    @Column(precision = 18, scale = 10)
    private BigDecimal latitude;

    @Column(precision = 18, scale = 10)
    private BigDecimal longitude;

    @Column(name = "staff_state")
    private String staffState = "offline";

    @OneToMany(mappedBy = "staff")
    private List<Vehicle> vehicles;

    //Danh sách những yêu cầu mà Staff này đã duyệt (với vai trò Coordinator).
    @OneToMany(mappedBy = "coordinator")
    private List<Request> coordinatedRequests;

    //Danh sách những nhiệm vụ mà Staff này phải đi làm (với vai trò Rescue Team).
    @OneToMany(mappedBy = "rescueTeam")
    private List<Request> assignedTasks;

    @OneToMany(mappedBy = "senderStaff")
    private List<Message> messages;
}
