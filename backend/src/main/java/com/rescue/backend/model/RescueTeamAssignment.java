package com.rescue.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "RescueTeamAssignment")
@Getter
@Setter
@NoArgsConstructor
public class RescueTeamAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinator_id", nullable = false)
    private Account coordinator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rescue_team_id", nullable = false)
    private Account rescueTeam;

    @Column(name = "vehicle_id", nullable = false)
    private UUID vehicleId;

    @Column(length = 20)
    private String status = "on the way";

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String report;
}
