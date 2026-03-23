# 4. System Design

## 4.1 System Architecture Overview
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
## 4.2 Backend Architecture (MVC2)
Although the system follows Client–Server architecture with a separate Frontend, the Backend follows the MVC2 pattern. In traditional Java Web applications, the View layer uses JSP pages. However, in this system, the View returns JSON responses instead, which makes Backend work more like API provider.

The Backend architecture is organized into three main parts: Model, View, and Controller:
### 4.2.1 Model
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

### 4.2.2 View (Adapted)
In a traditional MVC2 architecture, the View layer render user interfaces using technologies such as JSP.
But in this system, the View layer is adapted to provide data in JSON format instead, which will be handled by Frontend later. This allows Backend to focus on data processing.

The View layer consist many Data Transfer Objects (`com.rescue.backend.view.dto.*`)
- Request DTOs (`*.request`): Handles input data from client. 

- Response DTOs (`*.response`): Handles output data returned to client

The DTOs are grouped into domains such as auth, citizen, manager, rescueTeam, manager.

In addition, there is a common object (`common\ResponseObject.java`) for sharing between classes.

### 4.2.3 Controller
The Controller layer handles input HTTP requests and processes responses. 

It consists many classes (`com.rescue.backend.controller.controller.*`):
- The classes have @RestController annotation to mark as entry points to the system
- They manage overall request-response cycle and communication between client and backend system

## 4.3 Frontend Architecture
The Frontend is developed using React and is organized to separatedly handle user interface, business logic, and data structure.
### 4.3.1 Directory Structure
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
### 4.3.2 Summarized Directory Architecture
The directory structure above can be summarized into four groups to handle data flow:
| Group | Directories | Purpose |
| :--- | :--- | :--- |
|Foundation|assets/, lib/, types/, constants/|The base "building blocks" and external configurations|
|Logic & Data|services/, store/, hooks/, utils/|The "brain" of the app<br>Handles API calls, global state, and logic|
|Presentation|components/, layouts/|The visual layer<br>Renders UI and layout structures|
|Arrangement|pages/, router/, validations/|The "glue" of system<br>Connects logic to UI, manages user navigation|
### 4.3.3 Mapping to Backend MVC2
To make sure Frontend and Backend work well together, the Frontend's React architecture can be mapped to Backend's MVC2 architecture like below:
|Backend (Java)|Frontend (React)|Shared Purpose|
| :--- | :--- | :--- |
|Entities (`model.bean`)|Types (`types/`)|Defines data objects (Citizen, Request, etc)|
|DAOs (`model.dao`)|Services (`services/`)|Data operations<br>API call <-> Database CRUD|
|Services (`model.service`)|Hooks (hooks/)|Business logic & Handles interactions|
|DTOs (`view.dto`)|Validations/Mappers|Data format, validation<br>Data exchange between FE and BE|
|Controllers (`@RestController`)|Router/Pages|Manages requests flow<br> Control how users move through the system|
## 4.4 System Workflow

## 4.5 UML Diagrams

## 4.6 Technology Stack

### 4.6.1 Backend Technologies
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| Framework | Spring Boot | Main backend framework for building RESTful applications |
| Web | Spring MVC | Handles HTTP requests and REST APIs |
| Real-time | WebSocket (Spring) | Enables real-time communication (e.g., messaging) |
| Security | Spring Security | Authentication and authorization (JWT, BCrypt) |
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
| Dev Tools | Spring Boot DevTools | Hot reload during development |
| Testing | Spring Boot Test | Backend testing framework |
| Testing | Spring Security Test | Security-related testing utilities |
### 4.6.2 Frontend Technologies
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| Core | React | Component-based UI development |
| Core | TypeScript | Static typing and improved maintainability |
| Build Tool | Vite | Fast development server and optimized builds |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Styling | Radix UI | Accessible UI primitives |
| Styling | shadcn/ui | Pre-built UI components |
| Styling | Lucide React | Icon library |
| State Management | Zustand | Global state management |
| Data Fetching | TanStack Query | Server state management and caching |
| API Communication | Axios | HTTP client for backend communication |
| Routing | React Router | Client-side routing and navigation |
| Forms | React Hook Form | Efficient form handling |
| Validation | Zod | Schema-based validation |
| Maps | Vietmap GL JS | Interactive map integration |
| Notifications | React Toastify | User feedback via toast messages |
| Utilities | clsx | Conditional class handling |
| Utilities | tailwind-merge | Tailwind class conflict resolution |
| Utilities | class-variance-authority | Manage component variants |
| Dev Tools | ESLint | Code linting and quality control |
| Dev Tools | typescript-eslint | TypeScript linting rules |
| Dev Tools | Vite React Plugin | React integration for Vite |
## 4.7 Summary