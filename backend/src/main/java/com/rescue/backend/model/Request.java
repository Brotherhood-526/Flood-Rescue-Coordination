package com.rescue.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.locationtech.jts.geom.Point;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Entity
@Table(name = "Request")
@Getter @Setter @NoArgsConstructor
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Citizen citizen;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(length = 200)
    private String address;

    @Column(precision = 18, scale = 10, nullable = false)
    private BigDecimal latitude;

    @Column(precision = 18, scale = 10, nullable = false)
    private BigDecimal longitude;

    @Column(name = "geo_location", columnDefinition = "geography", insertable = false, updatable = false)
    private Point geoLocation;

    @Column(name = "additional_link", length = 200)
    private String additionalLink;

    @Column(length = 20)
    private String status = "processing";

    @Column(length = 20)
    private String urgency;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "request")
    private List<RequestImage> images;

    @OneToMany(mappedBy = "request")
    private List<Message> messages;

    @OneToMany(mappedBy = "request")
    private List<RescueTeamAssignment> rescueTeamAssignment;
}


