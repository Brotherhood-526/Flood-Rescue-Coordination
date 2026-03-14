package com.rescue.backend.model.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.rescue.backend.model.bean.*;
import com.rescue.backend.model.dao.CitizenDAO;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.RequestImageDAO;
import com.rescue.backend.model.dao.VehicleDAO;
import com.rescue.backend.view.dto.citizen.request.LookupRequest;
import com.rescue.backend.view.dto.citizen.request.RescueRequest;
import com.rescue.backend.view.dto.citizen.request.UpdateRequest;
import com.rescue.backend.view.dto.citizen.response.CitizenRescueResponse;
import com.rescue.backend.view.dto.image.response.LookupImageResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.rescue.backend.utils.CloudinaryUtils.extractPublicId;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenService {

    private final CitizenDAO citizenDAO;
    private final VehicleDAO vehicleDAO;
    private final RequestDAO requestDAO;
    private final RequestImageDAO requestImageDAO;
    private final Cloudinary cloudinary;

    @Transactional
    public CitizenRescueResponse createRescueRequest(RescueRequest rescueRequest) {

        List<String> activeStatuses = List.of("processing", "accept", "delayed");

        Optional<Request> existingRequest =
                requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(
                        activeStatuses,
                        rescueRequest.phone()
                );

        if (existingRequest.isPresent()) {
            throw new RuntimeException("EXISTING_ACTIVE_REQUEST");
        }

        Citizen citizen = citizenDAO.findByPhone(rescueRequest.phone())
                .orElseGet(() -> {
                    log.info("Creating new citizen with phone: {}", rescueRequest.phone());
                    Citizen newCitizen = new Citizen();
                    newCitizen.setPhone(rescueRequest.phone());
                    newCitizen.setName(rescueRequest.name());
                    return citizenDAO.save(newCitizen);
                });

        Request request = new Request();
        request.setCitizen(citizen);
        request.setType(rescueRequest.type().toLowerCase());
        request.setDescription(rescueRequest.description());
        request.setAddress(rescueRequest.address());
        request.setLatitude(rescueRequest.latitude());
        request.setLongitude(rescueRequest.longitude());
        request.setAdditionalLink(rescueRequest.additionalLink());

        Request savedRequest = requestDAO.save(request);

        if (rescueRequest.images() != null && !rescueRequest.images().isEmpty()) {

            List<RequestImage> requestImageList =
                    uploadNewImages(rescueRequest.images(), savedRequest);

            if (!requestImageList.isEmpty()) {
                requestImageDAO.saveAll(requestImageList);
                savedRequest.setImages(requestImageList);
            }

        } else {
            savedRequest.setImages(new ArrayList<>());
        }

        return mapToRequestResponse(savedRequest);
    }

    public CitizenRescueResponse mapToRequestResponse(Request request) {

        List<LookupImageResponse> imageList =
                (request.getImages() != null)
                        ? request.getImages().stream()
                        .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                        .toList()
                        : List.of();

        String coordinator =
                (request.getCoordinator() != null)
                        ? request.getCoordinator().getName()
                        : null;

        String leader =
                (request.getRescueTeam() != null)
                        ? request.getRescueTeam().getName()
                        : null;

        String vehicleType =
                (request.getVehicle() != null)
                        ? request.getVehicle().getType()
                        : null;

        return new CitizenRescueResponse(
                request.getId(),
                request.getAddress(),
                request.getDescription(),
                request.getAdditionalLink(),
                request.getCreatedAt(),
                request.getLatitude(),
                request.getLongitude(),
                request.getStatus(),
                request.getType(),
                request.getUrgency(),
                request.getCitizen().getId(),
                request.getCitizen().getName(),
                request.getCitizen().getPhone(),
                imageList,
                coordinator,
                leader,
                vehicleType
        );
    }

    public CitizenRescueResponse lookUpRequest(LookupRequest lookupRequest) {

        List<String> targetStatuses =
                List.of("processing", "delayed", "reject", "accept");

        return requestDAO
                .findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(
                        targetStatuses,
                        lookupRequest.citizenPhone()
                )
                .map(this::mapToRequestResponse)
                .orElse(null);
    }

    @Transactional
    public CitizenRescueResponse updateRescueRequest(UpdateRequest updateRequest) {

        Request request =
                requestDAO.findById(updateRequest.requestId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu này"));

        request.setType(updateRequest.Type());
        request.setDescription(updateRequest.description());
        request.setAddress(updateRequest.address());
        request.setAdditionalLink(updateRequest.additionLink());
        request.setLatitude(updateRequest.latitude());
        request.setLongitude(updateRequest.longitude());

        Citizen citizen = request.getCitizen();
        citizen.setName(updateRequest.citizenName());

        if (!citizen.getPhone().equals(updateRequest.citizenPhone())) {
            citizen.setPhone(updateRequest.citizenPhone());
        }

        if (updateRequest.deleteImageIds() != null && !updateRequest.deleteImageIds().isEmpty()) {

            List<RequestImage> imagesToDelete =
                    requestImageDAO.findAllById(updateRequest.deleteImageIds());

            imagesToDelete.forEach(this::deleteImageOnCloudinary);

            requestImageDAO.deleteAll(imagesToDelete);

            request.getImages().removeAll(imagesToDelete);
        }

        Request savedRequest = requestDAO.save(request);

        if (updateRequest.images() != null && !updateRequest.images().isEmpty()) {

            List<RequestImage> newImages =
                    uploadNewImages(updateRequest.images(), request);

            if (!newImages.isEmpty()) {

                requestImageDAO.saveAll(newImages);

                if (request.getImages() == null) {
                    request.setImages(new ArrayList<>());
                }

                request.getImages().addAll(newImages);
            }
        }

        return mapToRequestResponse(savedRequest);
    }

    private void deleteImageOnCloudinary(RequestImage image) {

        try {
            String publicId = extractPublicId(image.getImageUrl());
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.warn("Không thể xóa ảnh trên Cloudinary: {}", image.getImageUrl());
        }
    }

    private List<RequestImage> uploadNewImages(List<MultipartFile> files, Request request) {

        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> {

                    try {

                        Map<?, ?> uploadResult =
                                cloudinary.uploader().upload(
                                        file.getBytes(),
                                        ObjectUtils.asMap(
                                                "folder", "rescue_requests",
                                                "transformation",
                                                new Transformation<>()
                                                        .width(1000)
                                                        .crop("limit")
                                                        .quality("auto")
                                                        .fetchFormat("auto")
                                        )
                                );

                        RequestImage image = new RequestImage();
                        image.setImageUrl(uploadResult.get("secure_url").toString());
                        image.setRequest(request);

                        return image;

                    } catch (IOException e) {

                        log.error("Lỗi upload ảnh: {}", file.getOriginalFilename());
                        throw new RuntimeException("Lỗi khi upload ảnh lên Cloudinary", e);

                    }
                })
                .toList();
    }
}