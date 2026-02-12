package com.rescue.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Citizen")
@Getter @Setter @NoArgsConstructor
public class Citizen {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String phone;

    @OneToMany(mappedBy = "citizen")
    private List<Request> requests;
}
