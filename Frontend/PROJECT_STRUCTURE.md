# CẤU TRÚC DỰ ÁN - RESCUE SYSTEM FRONTEND

---

rescue-system-frontend/
│
├── public/  
│ └── vite.svg  
│
├── src/ # Source code chính
│ │
│ ├── api/ # API services và configuration
│ │ ├── axios.js # Axios instance config với interceptors
│ │ ├── authAPI.js # Authentication endpoints
│ │ ├── requestAPI.js # Request/mission management
│ │ ├── teamAPI.js # Team & employee management
│ │ └── vehicleAPI.js # Vehicle management
│ │
│ ├── assets/ # Static assets
│ │ ├── images/ # Images, photos
│ │ └── icons/ # Icon files
│ │
│ ├── components/ # Reusable components (Làm r bổ sung thêm)
│ │ ├── common/ # Common/shared components
│ │ │ └── ProtectedRoute.jsx # Route protection với role-based access
│ │ └── layout/ # Layout components
│ │ ├── Header.jsx # TODO: Header component
│ │ ├── Footer.jsx # TODO: Footer component
│ │ └── Sidebar.jsx # TODO: Sidebar component
│ │
│ ├── constants/ # Application constants
│ │ ├── roles.js # User roles (USER, MANAGER, COORDINATOR, RESCUE_TEAM)
│ │ └── status.js # Request/mission status, priorities
│ │
│ ├── context/ # React Context providers
│ │ └── AuthContext.jsx # Authentication context với login/logout
│ │
│ ├── hooks/ # Custom React hooks
│ │ └── index.js # Collection of custom hooks
│ │
│ ├── layouts/ # Page layouts cho từng role
│ │ ├── UserLayout.jsx # Layout cho USER role
│ │ ├── ManagerLayout.jsx # Layout cho MANAGER role (sidebar + header)
│ │ ├── CoordinatorLayout.jsx # Layout cho COORDINATOR role
│ │ └── RescueTeamLayout.jsx # Layout cho RESCUE_TEAM role
│ │
│ ├── pages/ # Page components (theo role)
│ │ │
│ │ ├── guest/ # Public pages (không cần login)
│ │ │ ├── LandingPage.jsx # Trang chủ với hero section
│ │ │ ├── LoginPage.jsx # Trang đăng nhập
│ │ │ ├── ContactPage.jsx # TODO: Trang liên hệ
│ │ │ ├── GuidePage.jsx # TODO: Hướng dẫn sử dụng
│ │ │ └── SearchPage.jsx # TODO: Tìm kiếm yêu cầu
│ │ │
│ │ ├── citizen/ # USER role pages
│ │ │ ├── RequestPage.jsx # TODO: Form tạo yêu cầu cứu hộ (với map picker)
│ │ │ ├── AfterRequestPage.jsx # TODO: Xem chi tiết sau khi tạo request
│ │ │ ├── EditRequestPage.jsx # TODO: Chỉnh sửa yêu cầu
│ │ │ └── ChatPage.jsx # TODO: Chat với điều phối viên
│ │ │
│ │ ├── manager/ # MANAGER role pages
│ │ │ ├── Overview.jsx # TODO: Dashboard với charts, stats
│ │ │ ├── StaffManagement.jsx # TODO: Table quản lý nhân viên
│ │ │ ├── VehicleManagement.jsx # TODO: Table quản lý phương tiện
│ │ │ ├── TeamManagement.jsx # TODO: Table quản lý đội cứu hộ
│ │ │ ├── AddEmployee.jsx # TODO: Form thêm nhân viên
│ │ │ ├── EditCoordinator.jsx # TODO: Form sửa coordinator
│ │ │ ├── AddTeam.jsx # TODO: Form thêm đội
│ │ │ ├── EditTeam.jsx # TODO: Form sửa đội
│ │ │ ├── AddTransport.jsx # TODO: Form thêm phương tiện
│ │ │ └── EditTransport.jsx # TODO: Form sửa phương tiện
│ │ │
│ │ ├── coordinator/ # COORDINATOR role pages
│ │ │ ├── RequestList.jsx # TODO: Table danh sách yêu cầu với filters
│ │ │ ├── RequestDetail.jsx # TODO: Chi tiết yêu cầu + phân công team
│ │ │ ├── Chat.jsx # TODO: Chat box với citizen/teams
│ │ │ └── Map.jsx # TODO: Bản đồ hiển thị các requests
│ │ │
│ │ └── rescueteam/ # RESCUE_TEAM role pages
│ │ ├── MissionList.jsx # TODO: Table danh sách nhiệm vụ
│ │ ├── MissionDetail.jsx # TODO: Chi tiết nhiệm vụ + cập nhật status
│ │ ├── Chat.jsx # TODO: Chat với coordinator
│ │ └── Map.jsx # TODO: Bản đồ nhiệm vụ với navigation
│ │
│ ├── services/ # Business logic services
│ │ ├── socketService.js # TODO: Socket.IO service cho real-time
│ │ ├── mapService.js # TODO: Google Maps/Leaflet integration
│ │ └── notificationService.js # TODO: Browser notifications
│ │
│ ├── utils/ # Utility functions
│ │ └── helpers.js # Helper functions (format date, validate, etc.)
│ │
│ ├── App.jsx # Main App với routing setup
│ ├── main.jsx # Entry point với providers
│ └── index.css # Global CSS với CSS variables
│
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── index.html  
├── package.json  
├── vite.config.js  
├── README.md  
└── PROJECT_STRUCTURE.md

### Guest Pages (Public)

- [ ] ContactPage - Form liên hệ
- [ ] GuidePage - Hướng dẫn sử dụng hệ thống
- [ ] SearchPage - Tìm kiếm yêu cầu công khai

### User Pages

- [ ] RequestPage - Form tạo yêu cầu với map picker
- [ ] AfterRequestPage - Hiển thị chi tiết request
- [ ] EditRequestPage - Form chỉnh sửa request
- [ ] ChatPage - Chat interface

### Manager Pages

- [ ] Overview - Dashboard với statistics, charts
- [ ] StaffManagement - CRUD nhân viên với table
- [ ] VehicleManagement - CRUD phương tiện
- [ ] TeamManagement - CRUD đội cứu hộ
- [ ] Form pages cho Add/Edit operations

### Coordinator Pages

- [ ] RequestList - Table với filters, search, pagination
- [ ] RequestDetail - View request + assign team
- [ ] Chat - Chat box
- [ ] Map - Google Maps với markers

### Rescue Team Pages

- [ ] MissionList - Table missions
- [ ] MissionDetail - View + update mission status
- [ ] Chat - Chat interface
- [ ] Map - Map với GPS tracking

### Services

- [ ] Socket.IO service cho real-time updates
- [ ] Map service (Leaflet)
- [ ] Notification service
- [ ] File upload service

### Components

- [ ] Header component
- [ ] Footer component
- [ ] Loading component
- [ ] Error boundary
- [ ] Chat message component
- [ ] Map marker component
- [ ] Status badge component
- [ ] Priority badge component

---
