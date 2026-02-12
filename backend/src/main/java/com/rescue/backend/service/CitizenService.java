package com.rescue.backend.service;

import com.cloudinary.Transformation;
import com.rescue.backend.DTOS.citizen.request.LookupRequest;
import com.rescue.backend.DTOS.citizen.request.RescueRequest;
import com.rescue.backend.DTOS.citizen.request.UpdateRequest;
import com.rescue.backend.DTOS.citizen.response.CitizenRescueResponse;
import com.rescue.backend.DTOS.image.request.ImageRequest;
import com.rescue.backend.DTOS.image.response.LookupImageResponse;
import com.rescue.backend.model.*;
import com.rescue.backend.repository.RequestImageRepository;
import com.rescue.backend.repository.RequestRepository;
import com.rescue.backend.repository.CitizenRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rescue.backend.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static com.rescue.backend.utils.CloudinaryUtils.extractPublicId;


@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenService {

    private final CitizenRepository citizenRepository;
    private final VehicleRepository vehicleRepository;
    private final RequestRepository requestRepository;
    private final RequestImageRepository requestImageRepository;
    private final Cloudinary cloudinary;

    @Transactional
    public CitizenRescueResponse createRescueRequest(RescueRequest rescueRequest) {
        // 1. Danh sách các trạng thái "chặn" không cho gửi thêm
        List<String> activeStatuses = List.of("processing", "accept", "delayed");
        Optional<Request> existingRequest = requestRepository.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(
                activeStatuses,
                rescueRequest.phone()
        );

        // 3. Nếu tìm thấy request đang hoạt động -> Thông báo lỗi
        if (existingRequest.isPresent()) {
            throw new RuntimeException("EXISTING_ACTIVE_REQUEST");
            // Bạn có thể tạo Custom Exception riêng để Controller bắt được dễ hơn
        }

        Citizen citizen = citizenRepository.findByPhone(rescueRequest.phone())
                .orElseGet(() -> {
                    log.info("Creating new citizen with phone: {}", rescueRequest.phone());
                    Citizen newCitizen = new Citizen();
                    newCitizen.setPhone(rescueRequest.phone());
                    newCitizen.setName(rescueRequest.name());
                    return citizenRepository.save(newCitizen);
                });

        Request request = new Request();
        request.setCitizen(citizen);
        request.setType(rescueRequest.type().toLowerCase());
        request.setDescription(rescueRequest.description());
        request.setAddress(rescueRequest.address());
        request.setLatitude(rescueRequest.latitude());
        request.setLongitude(rescueRequest.longitude());
        request.setAdditionalLink(rescueRequest.additionalLink());

        Request savedRequest = requestRepository.save(request);

        // 5. Xử lý Upload ảnh lên Cloudinary
        if (rescueRequest.images() != null && !rescueRequest.images().isEmpty()) {
            List<RequestImage> requestImageList = uploadNewImages(rescueRequest.images(), savedRequest);;

            if (!requestImageList.isEmpty()) {
                requestImageRepository.saveAll(requestImageList);
                savedRequest.setImages(requestImageList);
            }
        } else {
            savedRequest.setImages(new ArrayList<>());
        }

        return mapToRequestResponse(savedRequest);
    }

    public CitizenRescueResponse mapToRequestResponse(Request rescueRequest) {
        CitizenRescueResponse res = new CitizenRescueResponse();

        res.setRequestId(rescueRequest.getId());
        res.setAddress(rescueRequest.getAddress());
        res.setDescription(rescueRequest.getDescription());
        res.setAdditionalLink(rescueRequest.getAdditionalLink());
        res.setCreatedAt(rescueRequest.getCreatedAt());
        res.setLatitude(rescueRequest.getLatitude());
        res.setLongitude(rescueRequest.getLongitude());
        res.setType(rescueRequest.getType());


        res.setCitizenId(rescueRequest.getCitizen().getId());
        res.setCitizenName(rescueRequest.getCitizen().getName());
        res.setCitizenPhone(rescueRequest.getCitizen().getPhone());

        // Chuyển đổi danh sách ảnh để tránh lặp vô tận
        if (rescueRequest.getImages() != null) {
            List<LookupImageResponse> imageList = rescueRequest.getImages().stream()
                    .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                    .toList();
            res.setImages(imageList);
        } else {
            res.setImages(new ArrayList<>());
        }
        return res;
    }

    public CitizenRescueResponse lookUpRequest(LookupRequest lookupRequest) {
        List<String> targetStatues = List.of("processing", "delayed", "reject", "accept");
        Optional<Request> requestOpt = requestRepository.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(targetStatues, lookupRequest.citizenPhone());
        if (requestOpt.isEmpty()) {
            return null;
        }

        Request request = requestOpt.get();
        CitizenRescueResponse res = new CitizenRescueResponse();
        if ("reject".equals(request.getStatus())) {
            res.setRequestId(request.getId());
            res.setAddress(request.getAddress());
            res.setDescription(request.getDescription());
            res.setCreatedAt(request.getCreatedAt());
            res.setLatitude(request.getLatitude());
            res.setLongitude(request.getLongitude());
            res.setStatus(request.getStatus());
            res.setType(request.getType());
            res.setUrgency(request.getUrgency());
            res.setCitizenId(request.getCitizen().getId());
            res.setCitizenName(request.getCitizen().getName());
            res.setCitizenPhone(request.getCitizen().getPhone());

            if (request.getAdditionalLink() != null) {
                res.setAdditionalLink(request.getAdditionalLink());
            }

            if (request.getImages() != null) {
                List<LookupImageResponse> imageResponses = request.getImages().stream()
                        .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                        .toList();
                res.setImages(imageResponses);
            }
        } else {
            res.setRequestId(request.getId());
            res.setAddress(request.getAddress());
            res.setDescription(request.getDescription());
            res.setCreatedAt(request.getCreatedAt());
            res.setLatitude(request.getLatitude());
            res.setLongitude(request.getLongitude());
            res.setStatus(request.getStatus());
            res.setType(request.getType());
            res.setUrgency(request.getUrgency());
            res.setCitizenId(request.getCitizen().getId());
            res.setCitizenName(request.getCitizen().getName());
            res.setCitizenPhone(request.getCitizen().getPhone());

            if (request.getAdditionalLink() != null) {
                res.setAdditionalLink(request.getAdditionalLink());
            }

            if (request.getImages() != null) {
                List<LookupImageResponse> imageResponses = request.getImages().stream()
                        .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                        .toList();
                res.setImages(imageResponses);
            }

            if (request.getRescueTeamAssignment() != null && !request.getRescueTeamAssignment().isEmpty()) {
                RescueTeamAssignment assignment = request.getRescueTeamAssignment().getFirst();

                res.setCoordinatorName(assignment.getCoordinator().getName());
                res.setRescueLeaderName(assignment.getRescueTeam().getName());
                vehicleRepository.findById(assignment.getVehicleId()).ifPresent(v -> res.setVehicleType(v.getType()));
            }
        }

        return res;
    }

    @Transactional
    public CitizenRescueResponse updateRescueRequest(UpdateRequest updateRequest) {
        Request request = requestRepository.findById(updateRequest.requestId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu này"));

        request.setType(updateRequest.Type());
        request.setDescription(updateRequest.description());
        request.setAddress(updateRequest.address());
        request.setAdditionalLink(updateRequest.additionLink());
        request.setLatitude(updateRequest.latitude());
        request.setLongitude(updateRequest.longitude());

        Citizen citizen = request.getCitizen();
        citizen.setName(updateRequest.citizenName());
        // Kiểm tra nếu số điện thoại thay đổi (tránh lỗi duplicate nếu không cần thiết)
        if (!citizen.getPhone().equals(updateRequest.citizenPhone())) {
            // Có thể thêm logic kiểm tra trùng số điện thoại ở đây nếu cần
            citizen.setPhone(updateRequest.citizenPhone());
        }

        if (updateRequest.deleteImageIds() != null && !updateRequest.deleteImageIds().isEmpty()) {
            List<RequestImage> imagesToDelete = requestImageRepository.findAllById(updateRequest.deleteImageIds());

            // Xóa trên Cloudinary
            imagesToDelete.forEach(this::deleteImageOnCloudinary);

            // Xóa trong DB
            requestImageRepository.deleteAll(imagesToDelete);

            // QUAN TRỌNG: Xóa khỏi danh sách trong bộ nhớ (để response trả về đúng ngay lập tức)
            request.getImages().removeAll(imagesToDelete);
        }

        Request savedRequest = requestRepository.save(request);

        if (updateRequest.images() != null && !updateRequest.images().isEmpty()) {
            List<RequestImage> newImages = uploadNewImages(updateRequest.images(), request);

            if (!newImages.isEmpty()) {
                requestImageRepository.saveAll(newImages);

                // QUAN TRỌNG: Thêm vào danh sách hiện tại thay vì ghi đè (setImages)
                if (request.getImages() == null) {
                    request.setImages(new ArrayList<>());
                }
                request.getImages().addAll(newImages);
            }
        } else {
            request.setImages(new ArrayList<>());
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
                        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                                ObjectUtils.asMap(
                                        "folder", "rescue_requests",
                                                "transformation", new Transformation<>()
                                                .width(1000).crop("limit")
                                                .quality("auto")
                                                .fetchFormat("auto")
                                ));

                        RequestImage image = new RequestImage();
                        image.setImageUrl(uploadResult.get("secure_url").toString());
                        image.setRequest(request);
                        return image;
                    } catch (IOException e) {
                        log.error("Lỗi upload ảnh: {}", file.getOriginalFilename());
                        throw new RuntimeException("Lỗi khi upload ảnh lên Cloudinary", e);
                    }
                }).toList();
    }
}