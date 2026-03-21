package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Staff;
import com.rescue.backend.model.bean.Vehicle;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.StaffDAO;
import com.rescue.backend.model.dao.VehicleDAO;
import com.rescue.backend.view.dto.manager.request.CreateStaffRequest;
import com.rescue.backend.view.dto.manager.request.CreateVehicleRequest;
import com.rescue.backend.view.dto.manager.request.UpdateStaffRequest;
import com.rescue.backend.view.dto.manager.response.RescueTeamResponse;
import com.rescue.backend.view.dto.manager.response.StaffResponse;
import com.rescue.backend.view.dto.manager.response.TeamOwnerResponse;
import com.rescue.backend.view.dto.manager.response.VehicleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ManagerService {

    @Autowired
    private StaffDAO staffDAO;

    @Autowired
    private VehicleDAO vehicleDAO;

    @Autowired
    private RequestDAO requestDAO;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private static final List<String> VALID_VehicleTypes = List.of("xuồng", "trực thăng", "xe cứu hộ");
    private static final List<String> VALID_ROLES = List.of("điều phối viên", "cứu hộ");
    private static final int PAGE_SIZE = 1000;

    public Page<StaffResponse> getStaffs(String search, int page) {

        Pageable pageable = PageRequest.of(page, PAGE_SIZE);

        Page<Staff> staffs;

        if (search == null || search.isBlank()) {
            staffs = staffDAO.findAll(pageable);
        } else {
            String keyword = search.trim().toLowerCase();
            staffs = staffDAO.searchByKeyword(keyword, pageable);
        }

        return staffs.map(staff -> new StaffResponse(
                staff.getId(),
                staff.getName(),
                staff.getPhone(),
                staff.getRole(),
                staff.getStaffState()
        ));
    }

    public Page<StaffResponse> createStaffs(CreateStaffRequest createStaffRequest) {
        String role = createStaffRequest.role();
        if (role == null || !VALID_ROLES.contains(role.trim().toLowerCase())) {
            throw new IllegalArgumentException("Role không hợp lệ. Chỉ chấp nhận: 'điều phối viên' hoặc 'đội cứu hộ'");
        }

        if (staffDAO.existsByPhone(createStaffRequest.phone())) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + createStaffRequest.phone());
        }

        Staff staff = new Staff();

        staff.setName(createStaffRequest.name());
        staff.setPhone(createStaffRequest.phone());
        staff.setPassword(passwordEncoder.encode(createStaffRequest.password()));

        if ("điều phối viên".equalsIgnoreCase(createStaffRequest.role().trim())) {
            staff.setRole("điều phối viên");
            staff.setTeamName(null);
            staff.setTeamSize(null);
            staff.setLatitude(null);
            staff.setLongitude(null);
        } else {
            staff.setRole("cứu hộ");
            staff.setTeamName(createStaffRequest.team_name());
            staff.setTeamSize(createStaffRequest.team_size());
            staff.setLatitude(createStaffRequest.latitude());
            staff.setLongitude(createStaffRequest.longitude());
        }

        staffDAO.save(staff);
        return getStaffs(null, 0);

    }

    public Page<StaffResponse> updateStaff(UpdateStaffRequest updateStaffRequest, UUID id, String search, int page) {
        Staff staff = staffDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID" + id));

        String role = updateStaffRequest.role();
        if (role == null || !VALID_ROLES.contains(role.trim().toLowerCase())) {
            throw new IllegalArgumentException("Role không hợp lệ. Chỉ chấp nhận: 'điều phối viên' hoặc 'cứu hộ'");
        }

        if (!staff.getPhone().equals(updateStaffRequest.phone()) &&
                staffDAO.existsByPhone(updateStaffRequest.phone())) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + updateStaffRequest.phone());
        }

        staff.setName(updateStaffRequest.name());
        staff.setPhone(updateStaffRequest.phone());

        if (updateStaffRequest.password() != null && !updateStaffRequest.password().isBlank()) {
            staff.setPassword(passwordEncoder.encode(updateStaffRequest.password()));
        }

        if ("điều phối viên".equals(updateStaffRequest.role())) {
            staff.setRole("điều phối viên");
            staff.setTeamName(null);
            staff.setTeamSize(null);
            staff.setLatitude(null);
            staff.setLongitude(null);
        } else {
            staff.setRole("cứu hộ");
            staff.setTeamName(updateStaffRequest.team_name());
            staff.setTeamSize(updateStaffRequest.team_size());
            staff.setLatitude(updateStaffRequest.latitude());
            staff.setLongitude(updateStaffRequest.longitude());
        }

        staffDAO.save(staff);
        return getStaffs(search, page);

    }

    public Page<StaffResponse> deleteStaff(UUID id, String search) {
        if (!staffDAO.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy nhân viên với id:" + id);
        }

        staffDAO.deleteById(id);
        return getStaffs(search, 0);
    }

    // Vehicle
    public Page<VehicleResponse> getVehicles(String search, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);

        Page<Vehicle> vehicles;

        if (search == null || search.isBlank()) {
            vehicles = vehicleDAO.findAll(pageable);
        } else {
            String keyword = search.trim().toLowerCase();
            vehicles = vehicleDAO.searchVehicle(keyword, pageable);

        }
        return vehicles.map(vehicle -> new VehicleResponse(
                vehicle.getId(),
                vehicle.getType(),
                vehicle.getStaff().getName(),
                vehicle.getState()
        ));
    }

    public Page<VehicleResponse> createVehicle(CreateVehicleRequest createVehicleRequest) {
        String type = createVehicleRequest.type();
        if (type == null || !VALID_VehicleTypes.contains(type.trim().toLowerCase())) {
            throw new IllegalArgumentException("Loại phương tiện không hợp lệ. Chỉ chấp nhận: 'xuồng', 'xe cứu hộ', 'trực thăng'");
        }

        Vehicle vehicle = new Vehicle();

        Staff staff = staffDAO.findById(createVehicleRequest.rescueTeamId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đội cứu hộ với ID " + createVehicleRequest.rescueTeamId()));


        vehicle.setType(createVehicleRequest.type());
        vehicle.setStaff(staff);


        vehicleDAO.save(vehicle);
        return getVehicles(null, 0);
    }

    public Page<VehicleResponse> updateVehicle(CreateVehicleRequest createVehicleRequest, UUID vehicleId, String search, int page) {
        Vehicle vehicle = vehicleDAO.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với id" + vehicleId));

        Staff staff = staffDAO.findById(createVehicleRequest.rescueTeamId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đội cứu hộ với ID này"));

        String newType = createVehicleRequest.type();

        if (newType == null || !VALID_VehicleTypes.contains(newType.trim().toLowerCase())) {
            throw new IllegalArgumentException("Loại phương tiện '" + newType + "' không hợp lệ");
        }

        vehicle.setType(createVehicleRequest.type());
        vehicle.setStaff(staff);

        vehicleDAO.save(vehicle);
        return getVehicles(search, page);
    }

    public Page<VehicleResponse> deleteVehicle(UUID vehicleId, String search) {
        if (!vehicleDAO.existsById(vehicleId)) {
            throw new IllegalArgumentException("Không tìm thấy phương tiện với id: " + vehicleId);
        }

        vehicleDAO.deleteById(vehicleId);
        return getVehicles(search, 0);
    }

    public List<TeamOwnerResponse> getTeamOwners(String keyword) {
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        return staffDAO.findTeamOwners("cứu hộ", kw)
                .stream()
                .map(row -> new TeamOwnerResponse(
                        (UUID) row[0],
                        (String) row[1]
                ))
                .toList();
    }


    //Rescue team
    public Page<RescueTeamResponse> getRescueTeams(String search, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);

        Page<Staff> rescueTeams;

        if (search == null || search.isBlank()) {
            rescueTeams = staffDAO.findAllByRole("cứu hộ", pageable);
        } else {
            rescueTeams = staffDAO.searchByRoleAndKeyword("cứu hộ", search, pageable);
        }

        return rescueTeams.map(staff -> new RescueTeamResponse(
                staff.getId(),
                staff.getName(),
                staff.getTeamSize(),
                staff.getPhone(),
                staff.getStaffState(),
                requestDAO.countByRescueTeamId(staff.getId())
        ));
    }

}