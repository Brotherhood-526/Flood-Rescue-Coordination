# Project name: Flood Rescue Coordination

# Requirement

## 1. CÁC NHÓM NGƯỜI DÙNG VÀ CHỨC NĂNG

### 1.1. Citizen (Người dân)

_Yêu cầu hệ thống:_ Thiết bị cần kết nối mạng (Network) và bật định vị (GPS).

_Chức năng:_

- _Gửi yêu cầu cứu hộ:_ Gửi thông tin kèm vị trí định vị, mô tả chi tiết và hình ảnh hiện trường.
- _Theo dõi trạng thái:_ Cập nhật trạng thái.
- _Xác nhận hoàn tất:_ Xác nhận đã được giải cứu thành công.
- _Duy trì liên lạc:_ Cập nhật và ghi chú lại các thông tin cần thiết cho điều phối viên và đội cứu hộ.

### 1.2. Rescue Coordinator (Điều phối viên)

_Yêu cầu hệ thống:_ Được cấp tài khoản truy cập hệ thống.

_Chức năng:_

- _Tiếp nhận yêu cầu:_ Pop-up và hiển thị vị trí người dân trên bản đồ ngay khi có yêu cầu mới.
- _Xác minh yêu cầu:_ Thực hiện phê duyệt (Approve) hoặc từ chối (Reject) yêu cầu.
- _Phân loại mức độ:_ Đánh giá mức độ khẩn cấp (Low, Medium, High). Trong đó, mức High được áp dụng cho các trường hợp nguy hiểm đến tính mạng.
- _Quản lý phương tiện:_ Kiểm tra danh sách phương tiện sẵn có để điều động và cung cấp loại phương tiện phù hợp cho Rescue Team.
- _Điều phối nhiệm vụ:_ Gán một Rescue Team cụ thể cho một yêu cầu cứu hộ.
- _Theo dõi:_ Giám sát trạng thái tổng thể của tất cả các yêu cầu trong hệ thống.
- _Duy trì liên lạc:_ Theo dõi các cập nhật và ghi chú của người dùng.

### 1.3. Rescue Team (Đội cứu hộ)

_Yêu cầu hệ thống:_ Được cấp tài khoản truy cập hệ thống.

_Chức năng:_

- _Nhận nhiệm vụ:_ Pop-up khi được phân công; xem danh sách các nhiệm vụ được giao.
- _Xem chi tiết:_ Xem nội dung yêu cầu và vị trí của người dân trên bản đồ (dưới dạng marker tĩnh).
- _Cập nhật trạng thái:_ Chuyển đổi trạng thái: Có thể tạm hoãn, tiếp tục và hoàn thành nhiệm vụ.
- _Thông báo hoàn tất:_ Khi gửi thông báo giải cứu thành công, hệ thống tự động cập nhật trạng thái đồng bộ lên bảng dữ liệu của Citizen và Rescue Team.
- _Duy trì liên lạc:_ Cập nhật và ghi chú lại các thông tin cần thiết khi người dùng báo để hỗ trợ cho công tác cứu hộ (Có thêm sự hộ trợ của điều phối viên trong hộp thoại).

### 1.4. Manager (Người quản lý)

_Chức năng:_

- _Quản lý nhân viên:_ Tạo mới, chỉnh sửa và phân quyền tài khoản cho Điều phối viên, Quản lý (Role-based Access Control).
- _Quản lý đội nhóm (Rescue Teams):_ Thiết lập danh sách các đội cứu hộ, quản lý thành viên và khu vực hoạt động của từng đội.
- _Quản lý phương tiện:_ Thêm, xóa, sửa danh sách phương tiện và cập nhật tình trạng sẵn sàng (Available/Maintenance).
- _Tổng quát thống kê:_ Xem các chỉ số cơ bản bao gồm tổng số yêu cầu (Request), tỉ lệ thành công(%), số đội đang hoạt động, phương tiện có sẵn, hiệu suất của từng đội, danh sách tỉnh có nhiều yêu cầu gửi về nhất.

# Prototype GUI and Sitemap

## GUI Sitemap

### Guest

- **S1** Landing Page
- **S2** Contact Page
- **S3** Guide / Quick Search

### User (Citizen)

- **S04** Submit Request
- **S05** View Requests
- **S06** Edit Requests
- **S07** Message Box

### Staff (Rescue Team / Coordinator / Manager)

- **S8** Staff Login

  **Rescue Team**
  - **S9** Assignment List
  - **S10** Assignment Details
  - **S11** Map
  - **S12** Message Box

  **Coordinator**
  - **S13** Request List
  - **S14** Request Details
  - **S15** Map
  - **S16** Message Box

  **Manager**
  - **S17** Overview
  - **S18** Staff Management
  - **S19** Add Employee
  - **S20** Edit Staff
  - **S21** Add Rescue Team
  - **S22** Edit Rescue Team
  - **S23** Rescue Team Management
  - **S24** Vehicle Management
  - **S25** Add Vehicle
  - **S26** Edit Vehicle
---

## GUI Prototype Images

![S1 Landing Page](img/prototypeGUI/guest_landingPage.png)  
**S1. Landing Page**

![S2 Contact Page](img/prototypeGUI/guest_contactPage.png)  
**S2. Contact Page**

![S3 Guide / Quick Search](img/prototypeGUI/guest_quickSearch.png)  
**S3. Guide / Quick Search**

![S4 Submit Request](img/prototypeGUI/user_beforeRequest.png)  
**S4. Submit Request**

![S5 View Requests](img/prototypeGUI/user_afterRequest.png)  
**S5. View Requests**

![S6 Edit Requests](img/prototypeGUI/user_editRequest.png.png)  
**S6. Edit Requests**

![S7 Message Box](img/prototypeGUI/user_messageBox.jpg)
**S7** Message Box

![S8 Staff Login](img/prototypeGUI/staff_login.png)  
**S8. Staff Login**

![S9 Rescue Team – Assignment List](img/prototypeGUI/rescueTeam_listAssignment.png)  
**S9. Rescue Team – Assignment List**

![S10 Rescue Team – Assignment Details](img/prototypeGUI/rescueTeam_detailedAssignment.png)  
**S10. Rescue Team – Assignment Details**

![S11 Rescue Team – Map](img/prototypeGUI/rescueTeam_map.png)  
**S11. Rescue Team – Map**

![S12 Rescue Team – Message Box](img/prototypeGUI/rescueTeam_chatBox.png)  
**S13. Rescue Team – Message Box**

![S13 Coordinator – Request List](img/prototypeGUI/coordinator_listRequest.png)  
**S13. Coordinator – Request List**

![S14 Coordinator – Request Details](img/prototypeGUI/coordinator_detailedRequest.png)  
**S14. Coordinator – Request Details**

![S15 Coordinator – Map](img/prototypeGUI/coordinator_map.png)  
**S15. Coordinator – Map**

![S16 Coordinator – Message Box](img/prototypeGUI/coordinator_chatBox.png)  
**S16. Coordinator – Message Box**

![S17 Overview](img/prototypeGUI/manager_overview.png)  
**S17. Manager – Overview**
![S18 Staff Management](img/prototypeGUI/manager_staffManagement.png)  
**S18. Manager – Staff Management**
![S19 Add Employee](img/prototypeGUI/manager_addStaff.jpg)  
**S19. Manager – Add Employee**
![S20 Edit Staff](img/prototypeGUI/manager_editStaff.jpg)  
**S20. Manager – Edit Staff**
![S21 Add Rescue Team](img/prototypeGUI/manager_addRescueTeam.jpg)  
**S21. Manager – Add Rescue Team**
![S22 Edit Rescue Team](img/prototypeGUI/manager_editRescueTeam.jpg)  
**S22. Manager – Edit Rescue Team**
![S23 Rescue Team Management](img/prototypeGUI/manager_rescueTeamManagement.png)  
**S23. Manager – Rescue Team Management**
![S24 Vehicle Management](img/prototypeGUI/manager_vehicleManagement.png)  
**S24. Manager – Vehicle Management**
![S25 Add Vehicle](img/prototypeGUI/manager_addVehicle.jpg)  
**S25. Manager – Add Vehicle**
![S26 Edit Vehicle](img/prototypeGUI/manager_editVehicle.jpg)  
**S26. Manager – Edit Vehicle**

# ERD Diagram
![ERD Diagram](img/database/ERD_Diagram.jpg) 