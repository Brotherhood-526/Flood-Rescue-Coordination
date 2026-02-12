package com.rescue.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Account")
@Getter
@Setter
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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

    @Column(name = "account_state")
    private String accountState = "offline";

    @OneToMany(mappedBy = "account")
    private List<Vehicle> vehicles;
}
