# 5. Conclusion

## 5.1 Advantages
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

## 5.2 Limitations
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
## 5.3 Lesson Learned
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

## 5.4 Future Improvements
- Refine database design: restructure Rescue Teams to better represent specific vehicle types
- Improve handling of circular dependencies between Staff, Vehicle, and Request entities
- Implement soft delete (e.g. isDeleted flag) instead of permanently removing records
- Add WebSocket support for real-time coordination updates
- Enhance deployment pipeline for stability and scalability
- Introduce automated testing (unit and integration tests)

## 5.5 Conclusion
This project demonstrates the design and implementation of a flood rescue coordination system using a modern client–server architecture. By integrating a structured backend with Spring Boot and an interactive frontend supported by Vietmap, the system achieves a clear separation of concerns and maintainable design.

Although certain limitations remain, particularly in deployment stability and real-time capabilities, the project provides a solid foundation for further development. Overall, it reflects both the technical implementation and the team’s learning progress in applying modern software engineering practices.