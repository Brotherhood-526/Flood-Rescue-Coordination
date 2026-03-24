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

## 2. Prototype GUI and Sitemap

### GUI Sitemap

#### Guest

- **S1** Landing Page
- **S2** Contact Page
- **S3** Guide / Quick Search

#### User (Citizen)

- **S04** Submit Request
- **S05** View Requests
- **S06** Edit Requests
- **S07** Message Box

#### Staff (Rescue Team / Coordinator / Manager)

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

### GUI Prototype Images

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

![S6 Edit Requests](img/prototypeGUI/user_editRequest.png)  
**S6. Edit Requests**

![S7 Message Box](img/prototypeGUI/user_messageBox.jpg)
**S7. Message Box**

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

## 3. Database Design
![ERD Diagram](img/database/ERD_Diagram.png) 

## 4. System Design

### 4.1 System Architecture Overview
The system is designed using Client-Server architecture, with separated Frontend and Backend:

- Backend
    - Processes logic, handles requests, manages data
    - Returns data in JSON format through RESTful APIs

- Frontend
    - Handles user interface, user interaction, show data to users
    - Receives data from backend

- Communication
    - Performed via HTTP requests using JSON
    - Currently exploring WebSocket for real-time communication such as messaging

The system uses MySQL database to store and manage data. It interacts with Backend via JPA and Hibernate.   
### 4.2 Backend Architecture (MVC2)
Although the system follows Client–Server architecture with a separate Frontend, the Backend follows the MVC2 pattern. In traditional Java Web applications, the View layer uses JSP pages. However, in this system, the View returns JSON responses instead, which makes Backend work more like API provider.

The Backend architecture is organized into three main parts: Model, View, and Controller:
#### 4.2.1 Model
The Model layer is the system's data structures and logic. It has the following parts:

- Entities (`com.rescue.backend.model.bean`)
    - Contains classes like Citizen, Message, Request, RequestImage, Staff, Vehicle
    - The classes are mapped to database tables with JPA annotations
    
- Data Access Objects (`com.rescue.backend.model.dao`)
    - Contains classes like CitizenDAO, StaffDAO, RequestDAO
    - The classes extend JpaRepository to interact with Database

- Services (`com.rescue.backend.model.service`)
    - Contains classes like AuthService, CitizenService, ManagerService, RescueTeamService
    - The classes handles core logic, interactions between repositories interface using technologies like JSP.

#### 4.2.2 View (Adapted)
In a traditional MVC2 architecture, the View layer render user interfaces using technologies such as JSP.
But in this system, the View layer is adapted to provide data in JSON format instead, which will be handled by Frontend later. This allows Backend to focus on data processing.

The View layer consist many Data Transfer Objects (`com.rescue.backend.view.dto.*`)
- Request DTOs (`*.request`): Handles input data from client. 

- Response DTOs (`*.response`): Handles output data returned to client

The DTOs are grouped into domains such as auth, citizen, manager, rescueTeam, manager.

In addition, there is a common object (`common\ResponseObject.java`) for sharing between classes.

#### 4.2.3 Controller
The Controller layer handles input HTTP requests and processes responses. 

It consists many classes (`com.rescue.backend.controller.controller.*`):
- The classes have @RestController annotation to mark as entry points to the system
- They manage overall request-response cycle and communication between client and backend system

### 4.3 Frontend Architecture
The Frontend is developed using React and is organized to separatedly handle user interface, business logic, and data structure.
#### 4.3.1 Directory Structure
| Directory | Content |
| :--- | :--- |
|`assets/`| Static files such as images, icons, and SVGs|
|`components/`| Reusable UI components|
|- `ui/`| Shadcn primitives (button, dialog, input...)|
|- `(root)`| Custom components (ConfirmDialog, ProtectedRoute)|
|`constants/`| Shared constants like RESCUE_STATUS or COORDINATOR_STATUS|
|`hooks/`| Custom React hooks for state logic and side effects <br> Divided by domain roles (Coordinator/, Rescue/, Manager/, User/)|
|`layouts/`| Sructure wrappers for pages (Headers, Footers, MainLayout) <br> Render content with `<Outlet />`|
|`lib/`| Configurations or wrappers for third-party libraries <br> Is not app logic, but a bridge (MapProvider.tsx, queryClient.ts)|
|`pages/`| Route-specific components that call hooks and render UI <br> No heavy logic|
|`router/`| Routing configuration, grouped by role <br> Example: index.tsx, routes.ts, roles.ts|
|`services/`| API call methods, 1 service - 1 endpoint group <br>No UI or state, only send request and return data|
|`store/`| Global application state using Zustand <br> Specifically for shared data like authentication|
|`types/`| TypeScript interfaces and shared types (rescue.ts, citizen.ts)|
|`utils/`| Pure utility functions and data mappers|
|`validations/`| Form validation schemas (Zod) <br> Is apart from components for reuse and independent test|
#### 4.3.2 Summarized Directory Architecture
The directory structure above can be summarized into four groups to handle data flow:
| Group | Directories | Purpose |
| :--- | :--- | :--- |
|Foundation|assets/, lib/, types/, constants/|The base "building blocks" and external configurations|
|Logic & Data|services/, store/, hooks/, utils/|The "brain" of the app<br>Handles API calls, global state, and logic|
|Presentation|components/, layouts/|The visual layer<br>Renders UI and layout structures|
|Arrangement|pages/, router/, validations/|The "glue" of system<br>Connects logic to UI, manages user navigation|
#### 4.3.3 Mapping to Backend MVC2
To make sure Frontend and Backend work well together, the Frontend's React architecture can be mapped to Backend's MVC2 architecture like below:
|Backend (Java)|Frontend (React)|Shared Purpose|
| :--- | :--- | :--- |
|Entities (`model.bean`)|Types (`types/`)|Defines data objects (Citizen, Request, etc)|
|DAOs (`model.dao`)|Services (`services/`)|Data operations<br>API call <-> Database CRUD|
|Services (`model.service`)|Hooks (hooks/)|Business logic & Handles interactions|
|DTOs (`view.dto`)|Validations/Mappers|Data format, validation<br>Data exchange between FE and BE|
|Controllers (`@RestController`)|Router/Pages|Manages requests flow<br> Control how users move through the system|

### 4.4 Technology Stack

#### 4.4.1 Backend Technologies
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| Framework | Spring Boot | Main backend framework for building RESTful applications |
| Web | Spring MVC | Handles HTTP requests and REST APIs |
| Security | Spring Security | Authentication with Sessions <br> Password encryption with BCrypt |
| ORM | Spring Data JPA | Database abstraction layer |
| ORM | Hibernate | JPA implementation and ORM provider |
| Database | MySQL | Relational database for persistent storage |
| Spatial Data | Hibernate Spatial | Supports geographic/spatial queries |
| Spatial Data | JTS (Java Topology Suite) | Geometry processing for map features |
| Build Tool | Maven | Dependency management and build automation |
| Language | Java (21) | Core programming language |
| Utility | Lombok | Reduces boilerplate code (getters, setters, etc.) |
| Config | Spring Dotenv | Loads environment variables from `.env` |
| Media Storage | Cloudinary | Handles image upload and storage |
| API Docs | SpringDoc OpenAPI (Swagger) | API documentation and testing UI |
| Data Format | JSON | Data exchange format between frontend and backend |
#### 4.4.2 Frontend Technologies
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| Core | React | Component-based UI development |
| Core | TypeScript | Static typing and improved maintainability |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Styling | shadcn/ui | Pre-built UI components |
| Styling | Lucide React | Icon library |
| State Management | Zustand | Global state management |
| Data Fetching | TanStack Query | Server state management and caching |
| API Communication | Axios | HTTP client for backend communication |
| Routing | React Router | Client-side routing and navigation |
| Forms | React Hook Form | Efficient form handling |
| Validation | Zod | Schema-based validation |
| Maps | Vietmap GL JS | Interactive map integration |

## 5. Conclusion

### 5.1 Advantages
- Clear separation between Frontend and Backend
    - Frontend handles UI and interactions
    - Backend handles logic and data
    - Makes it easier to develop and maintain each side independently

- RESTful APIs
    - Backend exposes endpoints for frontend
    - Frontend can request and send data easily
    - Makes integration simpler

- Real-time map visualization with Vietmap GL JS
    - Shows rescue teams and requests dynamically
    - Helps users track locations in real time

- Backend with Spring Boot
    - Provides core frameworks for security, database, and services
    - Handles requests reliably and scales well

- Modular frontend structure
    - Organized folders for components, hooks, services, and store
    - Easy to add features or fix issues

- Efficient data management
    - MySQL with JPA and Hibernate
    - Entities and DAOs handle database interactions
    - Keeps data consistent and reliable

### 5.2 Limitations
- Deployment
    - Frontend, backend, database, and third-party services all need setup
    - Can be tricky to coordinate

- WebSocket
    - Real-time communication is partial
    - Some features like live updates are not fully implemented

- Many technologies
    - Multiple frameworks and libraries in the project
    - Increases complexity and learning curve

- Automated testing
    - Few or no unit/integration tests
    - Makes catching errors harder

- Performance
    - Real-time updates and multiple users can slow things down
    - May need optimization in future

- External dependencies
    - Cloudinary for media, Vietmap APIs for maps
    - Can be affected by service changes or downtime
### 5.3 Lesson Learned
- Teamwork
    - Effective task distribution and communication are critical for collaborative development
    - Early in the project, the absence of a unified workflow led to inefficiencies in coordination
    - Major changes to source code, database structures, or business logic highlighted the need for timely communication to ensure all members understood the overall project flow
    - The lack of a task management system resulted in overlooked tasks and occasional missed deadlines
    - Proactive information sharing is essential for effective problem-solving and collaboration

- Version Control
    - This project marked the team’s first experience using Git and GitHub for collaborative development
    - Through hands-on practice, the team learned to manage versions, coordinate work, and resolve conflicts efficiently

- Technical and Practical Experience
    - Initial underestimation of workload emphasized the importance of realistic project planning
    - Synchronization of configuration files (e.g., .env, database) and source code between frontend and backend proved essential
    - Backend exception handling is crucial to support debugging and maintain system stability
    - Debugging in both local and production environments provided valuable hands-on experience
    - Careful analysis of backend use cases helped prevent unexpected errors
    - Exposure to multiple new technologies improved the team’s self-learning and problem-solving abilities

- Time Management
    - Effective planning and time allocation throughout the development process are essential to maintain project progress and meet deadlines

### 5.4 Future Improvements
- Refine database design: restructure Rescue Teams to better represent specific vehicle types
- Improve handling of circular dependencies between Staff, Vehicle, and Request entities
- Implement soft delete (e.g. isDeleted flag) instead of permanently removing records
- Add WebSocket support for real-time coordination updates
- Enhance deployment pipeline for stability and scalability
- Introduce automated testing (unit and integration tests)

### 5.5 Conclusion
This project demonstrates the design and implementation of a flood rescue coordination system using a modern client–server architecture. By integrating a structured backend with Spring Boot and an interactive frontend supported by Vietmap, the system achieves a clear separation of concerns and maintainable design.

Although certain limitations remain, particularly in deployment stability and real-time capabilities, the project provides a solid foundation for further development. Overall, it reflects both the technical implementation and the team’s learning progress in applying modern software engineering practices.