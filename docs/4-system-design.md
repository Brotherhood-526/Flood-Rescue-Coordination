# 4. System Design

## 4.1 System Architecture Overview
The system is designed using Client-Server architecture, with separated Frontend and Backend:

- Backend
    + Processes logic, handles requests, manages data
    + Returns data in JSON format through RESTful APIs

- Frontend
    + Handles user interface, user interaction, show data to users
    + Receives data from backend

- Communication
    + Performed via HTTP requests using JSON
    + Currently exploring WebSocket for real-time communication such as messaging

The system uses MySQL database to store and manage data. It interacts with Backend via JPA and Hibernate.   
## 4.2 Backend Architecture (MVC2)
Although the system follows Client–Server architecture with a separate frontend, the Backend follows the MVC2 pattern. In traditional Java Web applications, the View layer uses JSP pages. However, in this system, the View returns JSON responses instead, which makes Backend work more like API provider.

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

## 4.3 Frontend Architecture

### 4.3.1 Model (Client-side)

### 4.3.2 View

### 4.3.3 ViewModel / Controller

## 4.4 System Workflow

## 4.5 UML Diagrams

## 4.6 Technology Stack

### 4.6.1 Backend Technologies

### 4.6.2 Frontend Technologies

## 4.7 Summary