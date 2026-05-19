package com.rescue.backend;

import com.cloudinary.Cloudinary;
import com.rescue.backend.controller.exception.BusinessException;
import com.rescue.backend.controller.exception.ErrorCode;
import com.rescue.backend.model.bean.Citizen;
import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.bean.RequestImage;
import com.rescue.backend.model.dao.CitizenDAO;
import com.rescue.backend.model.dao.MessageDAO;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.RequestImageDAO;
import com.rescue.backend.model.service.ChatService;
import com.rescue.backend.model.service.CitizenService;
import com.rescue.backend.view.dto.citizen.request.RescueRequest;
import com.rescue.backend.view.dto.citizen.response.CitizenRescueResponse;
import mockit.*;
import mockit.integration.junit5.JMockitExtension;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(JMockitExtension.class)          // ← JMockit extension cho JUnit 5
class CitizenServiceJMockitTest {

    // @Injectable: JMockit tạo mock và tự inject vào @Tested bên dưới
    @Injectable private RequestDAO requestDAO;
    @Injectable private CitizenDAO citizenDAO;
    @Injectable private RequestImageDAO requestImageDAO;
    @Injectable private MessageDAO messageDAO;
    @Injectable private Cloudinary cloudinary;
    @Injectable private ChatService chatService;

    // @Tested: JMockit tạo instance thật, inject các @Injectable vào constructor/field
    @Tested
    private CitizenService citizenService;

    // ------------------------------------------------------------------ //
    //  Test 1: Throw exception khi đã có request đang active              //
    // ------------------------------------------------------------------ //
    @Test
    @DisplayName("Thất bại: Throw Exception khi số điện thoại đã có yêu cầu đang active")
    void createRescueRequest_ExistingActiveRequest_ThrowsException() {
        System.out.println("\n=== BẮT ĐẦU TEST 1: Ném lỗi khi đã có yêu cầu active ===");

        System.out.println("[BƯỚC 1] Chuẩn bị dữ liệu đầu vào (DTO).");
        RescueRequest dto = new RescueRequest(
                "tiếp tế", "Địa chỉ John", BigDecimal.valueOf(10.6), BigDecimal.valueOf(100.0),
                "lũ lụt", "John", "0901234567", null, null
        );

        System.out.println("[BƯỚC 2] Thiết lập MOCK (Expectations).");
        new Expectations() {{
            requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc((List<String>) any, anyString);
            result = Optional.of(new Request());
            System.out.println("   -> Đã mock: Giả vờ database báo 'Tồn tại request đang active'!");
        }};

        System.out.println("[BƯỚC 3] Chạy hàm thực tế và mong đợi ném ra lỗi BusinessException...");
        BusinessException exception = assertThrows(BusinessException.class,
                () -> citizenService.createRescueRequest(dto));

        System.out.println("[BƯỚC 4] Kiểm tra mã lỗi. Kỳ vọng: " + ErrorCode.EXISTING_ACTIVE_REQUEST);
        assertEquals(ErrorCode.EXISTING_ACTIVE_REQUEST, exception.getErrorCode());

        System.out.println("[BƯỚC 5] Đảm bảo code bị chặn lại, hàm save() KHÔNG BAO GIỜ được gọi.");
        new Verifications() {{
            citizenDAO.save((Citizen) any); times = 0;
            requestDAO.save((Request) any); times = 0;
        }};
        System.out.println("=== KẾT THÚC TEST 1: THÀNH CÔNG ===\n");
    }

    // ------------------------------------------------------------------ //
    //  Test 2: Tạo request thành công, người dân mới, không có ảnh        //
    // ------------------------------------------------------------------ //
    @Test
    @DisplayName("Happy-Path: Tạo yêu cầu thành công cho người dân mới (Không có ảnh)")
    void createRescueRequest_NewCitizenNoImages_Success() {
        System.out.println("\n=== BẮT ĐẦU TEST 2: Tạo yêu cầu thành công (Người mới, Không ảnh) ===");

        System.out.println("[BƯỚC 1] Khởi tạo dữ liệu đầu vào (DTO) và chuẩn bị Object kết quả giả.");
        RescueRequest dto = new RescueRequest(
                "tiếp tế", "Địa chỉ Alice", BigDecimal.valueOf(10.6), BigDecimal.valueOf(100.0),
                "lũ lụt", "Alice", "0987654321", null, null
        );

        Citizen savedCitizen = new Citizen();
        savedCitizen.setId(UUID.randomUUID());
        savedCitizen.setPhone("0987654321");
        savedCitizen.setName("Alice");

        Request savedRequest = new Request();
        savedRequest.setId(UUID.randomUUID());
        savedRequest.setCitizen(savedCitizen);
        savedRequest.setImages(new ArrayList<>());

        System.out.println("[BƯỚC 2] Thiết lập MOCK (Expectations)...");
        new Expectations() {{
            requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc((List<String>) any, anyString);
            result = Optional.empty();

            citizenDAO.findByPhone(anyString);
            result = Optional.empty(); // Giả lập người mới hoàn toàn

            citizenDAO.save((Citizen) any);
            result = new Delegate<Citizen>() {
                Citizen delegate(Citizen c) {
                    System.out.println("   [MOCK-DELEGATE] citizenDAO.save() vừa được gọi! Đang gắn UUID cho Citizen...");
                    c.setId(savedCitizen.getId());
                    return c;
                }
            };

            requestDAO.save((Request) any);
            result = new Delegate<Request>() {
                Request delegate(Request r) {
                    System.out.println("   [MOCK-DELEGATE] requestDAO.save() vừa được gọi! Đang copy dữ liệu vào Request mới...");
                    savedRequest.setType(r.getType());
                    savedRequest.setDescription(r.getDescription());
                    savedRequest.setAddress(r.getAddress());
                    savedRequest.setLatitude(r.getLatitude());
                    savedRequest.setLongitude(r.getLongitude());
                    savedRequest.setAdditionalLink(r.getAdditionalLink());
                    savedRequest.setCitizen(r.getCitizen());
                    return savedRequest;
                }
            };
        }};

        System.out.println("[BƯỚC 3] Bắt đầu thực thi logic chính của CitizenService...");
        CitizenRescueResponse response = citizenService.createRescueRequest(dto);

        System.out.println("[BƯỚC 4] Thực hiện ASSERT: Kiểm tra Response trả về có đúng dữ liệu không...");
        assertNotNull(response);
        assertEquals("tiếp tế", response.type());
        assertEquals("Alice", response.citizenName());
        assertEquals("0987654321", response.citizenPhone());
        assertNotNull(response.images());
        assertTrue(response.images().isEmpty());
        System.out.println("   -> Mọi dữ liệu trả về đều chính xác!");

        System.out.println("[BƯỚC 5] Thực hiện VERIFY: Kiểm tra xem các hàm lưu DB có gọi đúng biến/đúng số lần không...");
        new Verifications() {{
            Citizen capturedCitizen;
            citizenDAO.save(capturedCitizen = withCapture());
            times = 1;
            assertEquals("Alice", capturedCitizen.getName());
            assertEquals("0987654321", capturedCitizen.getPhone());
            System.out.println("   -> Verify OK: Đã gọi lưu Citizen Alice đúng 1 lần.");

            Request capturedRequest;
            requestDAO.save(capturedRequest = withCapture());
            times = 1;
            assertEquals("tiếp tế", capturedRequest.getType());
            assertEquals("lũ lụt", capturedRequest.getDescription());
            assertEquals("Địa chỉ Alice", capturedRequest.getAddress());
            System.out.println("   -> Verify OK: Đã gọi lưu Request với thông tin chính xác.");

            requestImageDAO.saveAll((Iterable<RequestImage>) any);
            times = 0;
            System.out.println("   -> Verify OK: Không gọi lưu danh sách ảnh (vì người dùng không gửi ảnh).");
        }};

        System.out.println("=== KẾT THÚC TEST 2: THÀNH CÔNG ===\n");
    }
}