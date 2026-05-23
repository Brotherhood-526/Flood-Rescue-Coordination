package com.rescue.backend;

//import com.cloudinary.Cloudinary;
//import com.cloudinary.Uploader;
import com.rescue.backend.controller.exception.BusinessException;
import com.rescue.backend.controller.exception.ErrorCode;
import com.rescue.backend.model.bean.Citizen;
import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.bean.RequestImage;
import com.rescue.backend.model.dao.CitizenDAO;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.RequestImageDAO;
import com.rescue.backend.model.service.CitizenService;
import com.rescue.backend.view.dto.citizen.request.RescueRequest;
import com.rescue.backend.view.dto.citizen.response.CitizenRescueResponse;
import mockit.Delegate;
import mockit.Expectations;
import mockit.Verifications;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

// Kích hoạt Mockito cho class test này (thay vì phải gọi MockitoAnnotations.openMocks())
// Nó sẽ tìm tất cả các field có @Mock và khởi tạo chúng, sau đó nhét chúng vào field có @InjectMocks.
// Hoàn toàn cách ly với Spring Boot (không cần load database, không cần tạo application context). Do đó nó chạy siêu tốc (mili-giây).
@ExtendWith(MockitoExtension.class)
class CitizenServiceTest {

    // Tạo các đối tượng giả (Mock) thay thế cho các dependency thực tế
    // Nó không có logic thật. Nếu bạn gọi một hàm trên object
    // @Mock mà chưa cấu hình (stubbing), nó sẽ trả về null (hoặc false/0/empty collection).
    @Mock private RequestDAO requestDAO;
    @Mock private CitizenDAO citizenDAO;
    @Mock private RequestImageDAO requestImageDAO;
    //@Mock private Cloudinary cloudinary;
    //@Mock private Uploader uploader; // Hỗ trợ mock cloudinary.uploader()

    // Bơm (Inject) các @Mock ở trên vào trong instance của CitizenService
    //Tạo ra một instance THẬT của Class bạn muốn test (ở đây là CitizenService).
    // Nó sẽ tự động dò tìm các @Mock bạn định nghĩa phía trên và "tiêm" (inject) vào constructor của CitizenService.
    @InjectMocks
    private CitizenService citizenService;

    // Bắt lấy tham số (Capture) để kiểm tra chi tiết dữ liệu được truyền vào hàm save
    // Đôi khi bạn gọi requestDAO.save(request), nhưng cái request đó được khởi tạo bằng từ khóa new Request()
    // ngay BÊN TRONG hàm createRescueRequest. Làm sao bạn lấy được cái request đó ra ở file test
    // để kiểm tra xem nó map dữ liệu latitude, longitude có đúng không? ArgumentCaptor sinh ra để làm việc đó.
    // Cách hoạt động: Khi hàm verify(requestDAO).save(captor.capture()) chạy,
    //                 nó sẽ "chụp" (thó) lấy đối tượng Request vừa được truyền vào,
    //                 sau đó bạn dùng captor.getValue() để lấy đối tượng đó ra và dùng các lệnh assertEquals kiểm tra từng field
    @Captor
    private ArgumentCaptor<Citizen> citizenCaptor;

    @Captor
    private ArgumentCaptor<Request> requestCaptor;

    @Test
    @DisplayName("Thất bại: Throw Exception khi số điện thoại đã có yêu cầu đang active")
    void createRescueRequest_ExistingActiveRequest_ThrowsException() {
        // --- GIVEN (Chuẩn bị dữ liệu) ---
        RescueRequest dto = new RescueRequest("tiếp tế0901234567", "John", BigDecimal.valueOf(10.6), BigDecimal.valueOf(100.0), "lũ lụt", "trí võ", "0901234567", null, null);

        //
        // when(...).thenReturn(...) (Giả lập Stubbing): Khi requestDAO gọi hàm tìm kiếm, trả về một Optional CÓ chứa Request
        // Cú pháp: when(mockObject.method(tham_số)).thenReturn(kết_quả_mong_muốn);
        // Nếu trong một hàm có nhiều tham số, bạn đã dùng Matcher cho 1 tham số, thì CÁC THAM SỐ CÒN LẠI CŨNG PHẢI DÙNG MATCHER.
        when(requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(anyList(), eq("0901234567")))
                .thenReturn(Optional.of(new Request()));

        // --- WHEN & THEN (Thực thi và Kiểm tra lỗi) ---
        // Bọc lời gọi hàm trong assertThrows để xác nhận nó có quăng ra BusinessException không
        // Dùng để test các luồng bị lỗi (Exception). Hàm này kỳ vọng đoạn code bên trong Lambda () -> { ... } SẼ văng ra một lỗi cụ thể.
        // Trả về chính cái Exception đó để bạn có thể .getErrorCode()
        // và kiểm tra xem mã lỗi có đúng ý đồ không (ví dụ kiểm tra có đúng là EXISTING_ACTIVE_REQUEST không).
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            citizenService.createRescueRequest(dto);
        });

        // Kiểm tra xem mã lỗi quăng ra có chuẩn không
        assertEquals(ErrorCode.EXISTING_ACTIVE_REQUEST, exception.getErrorCode());

        // Xác nhận rằng hàm lưu citizen và request KHÔNG BAO GIỜ được gọi tới (bảo vệ database)
        verify(citizenDAO, never()).save(any());
        verify(requestDAO, never()).save(any());
    }

    @Test
    @DisplayName("Happy-Path: Tạo yêu cầu thành công cho người dân mới (Không có ảnh)")
    void createRescueRequest_NewCitizenNoImages_Success1() {
        // --- 1. GIVEN: Sắp xếp bối cảnh ---
        // Tạo DTO đầu vào, chú ý danh sách ảnh (images) đang để null
        RescueRequest dto = new RescueRequest("0987654321", "Alice", BigDecimal.valueOf(10.6), BigDecimal.valueOf(100.0), "lũ lụt", "tiếp tế", null, null, null);

        // Giả lập: Không tìm thấy yêu cầu nào đang active
        when(requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(anyList(), anyString()))
                .thenReturn(Optional.empty());

        // Giả lập: Không tìm thấy Citizen nào với số điện thoại này -> Sẽ kích hoạt logic tạo mới (.orElseGet)
        when(citizenDAO.findByPhone("0987654321")).thenReturn(Optional.empty());

        // Giả lập: Khi citizenDAO.save được gọi, trả về một đối tượng đã có ID
        Citizen savedCitizen = new Citizen();
        savedCitizen.setId(UUID.randomUUID());
        savedCitizen.setPhone("0987654321");
        when(citizenDAO.save(any(Citizen.class))).thenReturn(savedCitizen);

        // Giả lập: Khi requestDAO.save được gọi, trả về một Request hợp lệ
        Request savedRequest = new Request();
        savedRequest.setId(UUID.randomUUID());
        savedRequest.setCitizen(savedCitizen);
        when(requestDAO.save(any(Request.class))).thenReturn(savedRequest);

        // --- 2. WHEN: Gọi hàm nghiệp vụ ---
        CitizenRescueResponse response = citizenService.createRescueRequest(dto);

        // --- 3. THEN: Kiểm tra kết quả ---
        assertNotNull(response); // Đảm bảo trả về không rỗng

        // Bắt lấy tham số truyền vào citizenDAO.save() để kiểm tra xem nó có map đúng dữ liệu không
        verify(citizenDAO, times(1)).save(citizenCaptor.capture());
        assertEquals("Alice", citizenCaptor.getValue().getName());
        assertEquals("0987654321", citizenCaptor.getValue().getPhone());

        // Bắt lấy tham số của requestDAO.save()
        // Trong Unit Test, ngoài việc kiểm tra "Kết quả trả về" (Assert), bạn phải kiểm tra "Hành vi" (Verify).
        // Tức là hỏi Mockito: "Nãy giờ hàm X của DAO Y có được gọi lần nào không?
        verify(requestDAO, times(1)).save(requestCaptor.capture());
        assertEquals("tiếp tế", requestCaptor.getValue().getType());

        // Xác nhận hàm lưu ảnh không bị gọi nhầm
        // times(1): Gọi đúng 1 lần (đây là giá trị mặc định, bạn có thể viết verify(dao).save(...) là đủ).
        // never(): Giống times(0). Rất quan trọng trong các test case báo lỗi để chứng minh hệ thống
        // đã ngắt luồng (abort) kịp thời, không ghi rác vào Database.
        verify(requestImageDAO, never()).saveAll(any());
    }

//    @Test
//    @DisplayName("Happy-Path: Tạo yêu cầu thành công cho người dân CŨ (Có đính kèm ảnh)")
//    void createRescueRequest_ExistingCitizenWithImages_Success() throws Exception {
//        // --- 1. GIVEN ---
//        // Tạo file ảnh giả lập (MockMultipartFile)
//        MultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "image-content".getBytes());
//        RescueRequest dto = new RescueRequest("0911111111", "Bob", "y tế", "địa chỉ", 1.0, 2.0, "link", List.of(mockImage));
//
//        // Bỏ qua check Request active
//        when(requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(anyList(), anyString()))
//                .thenReturn(Optional.empty());
//
//        // Người dân đã tồn tại trong DB, nên trả về Optional CÓ dữ liệu
//        Citizen existingCitizen = new Citizen();
//        existingCitizen.setId(UUID.randomUUID());
//        when(citizenDAO.findByPhone("0911111111")).thenReturn(Optional.of(existingCitizen));
//
//        // Mock DAO trả về request
//        Request savedRequest = new Request();
//        savedRequest.setId(UUID.randomUUID());
//        savedRequest.setCitizen(existingCitizen);
//        when(requestDAO.save(any(Request.class))).thenReturn(savedRequest);
//
//        // Giả lập hành vi của thư viện Cloudinary
//        when(cloudinary.uploader()).thenReturn(uploader);
//        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(Map.of("secure_url", "https://mock-url.com/img.jpg"));
//
//        // --- 2. WHEN ---
//        CitizenRescueResponse response = citizenService.createRescueRequest(dto);
//
//        // --- 3. THEN ---
//        assertNotNull(response);
//
//        // Vì người dân đã tồn tại, hàm citizenDAO.save() KHÔNG ĐƯỢC PHÉP gọi
//        verify(citizenDAO, never()).save(any());
//
//        // Hàm requestDAO.save() được gọi 1 lần
//        verify(requestDAO, times(1)).save(any(Request.class));
//
//        // Xác nhận ảnh đã được lưu vào database
//        verify(requestImageDAO, times(1)).saveAll(anyList());
//    }


    @Test
    @DisplayName("Happy-Path: Tạo yêu cầu thành công cho người dân mới (Không có ảnh)")
    void createRescueRequest_NewCitizenNoImages_Success() {

        RescueRequest dto = new RescueRequest(
                "tiếp tế",
                "Địa chỉ Alice",
                BigDecimal.valueOf(10.6),
                BigDecimal.valueOf(100.0),
                "lũ lụt",
                "Alice",
                "0987654321",
                null,
                null
        );

        Citizen savedCitizen = new Citizen();
        savedCitizen.setId(UUID.randomUUID());
        savedCitizen.setPhone("0987654321");
        savedCitizen.setName("Alice");

        Request savedRequest = new Request();
        savedRequest.setId(UUID.randomUUID());
        savedRequest.setCitizen(savedCitizen);
        savedRequest.setType("tiếp tế");
        savedRequest.setDescription("lũ lụt");
        savedRequest.setAddress("Địa chỉ Alice");
        savedRequest.setLatitude(BigDecimal.valueOf(10.6));
        savedRequest.setLongitude(BigDecimal.valueOf(100.0));
        savedRequest.setAdditionalLink(null);
        savedRequest.setImages(new ArrayList<>());

        new Expectations() {{
            requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(
                    (List<String>) any,
                    anyString
            );
            result = Optional.empty();

            citizenDAO.findByPhone(anyString);
            result = Optional.empty();

            citizenDAO.save((Citizen) any);
            result = new Delegate<Citizen>() {
                Citizen delegate(Citizen citizen) {
                    citizen.setId(savedCitizen.getId());
                    return citizen;
                }
            };

            // FIX: return thẳng savedRequest đã chuẩn bị sẵn
            requestDAO.save((Request) any);
            result = new Delegate<Request>() {
                Request delegate(Request request) {
                    // Copy các field cần thiết vào savedRequest để Verifications vẫn capture được
                    savedRequest.setType(request.getType());
                    savedRequest.setDescription(request.getDescription());
                    savedRequest.setAddress(request.getAddress());
                    savedRequest.setLatitude(request.getLatitude());
                    savedRequest.setLongitude(request.getLongitude());
                    savedRequest.setAdditionalLink(request.getAdditionalLink());
                    savedRequest.setCitizen(request.getCitizen());
                    return savedRequest; // ← trả về object không null, đã có setImages sẵn
                }
            };
        }};

        CitizenRescueResponse response = citizenService.createRescueRequest(dto);

        assertNotNull(response);
        assertEquals("tiếp tế", response.type());
        assertEquals("Alice", response.citizenName());
        assertEquals("0987654321", response.citizenPhone());
        assertNotNull(response.images());
        assertTrue(response.images().isEmpty());

        new Verifications() {{
            Citizen capturedCitizen;
            citizenDAO.save(capturedCitizen = withCapture());
            times = 1;

            assertEquals("Alice", capturedCitizen.getName());
            assertEquals("0987654321", capturedCitizen.getPhone());

            Request capturedRequest;
            requestDAO.save(capturedRequest = withCapture());
            times = 1;

            assertEquals("tiếp tế", capturedRequest.getType());
            assertEquals("lũ lụt", capturedRequest.getDescription());
            assertEquals("Địa chỉ Alice", capturedRequest.getAddress());
            assertEquals(BigDecimal.valueOf(10.6), capturedRequest.getLatitude());
            assertEquals(BigDecimal.valueOf(100.0), capturedRequest.getLongitude());

            requestImageDAO.saveAll((Iterable<RequestImage>) any);
            times = 0;
        }};
    }
}