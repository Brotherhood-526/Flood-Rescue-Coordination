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
- Teamwork:
  - The team realized the importance of proper task distribution and maintaining effective communication among members.
  - At the beginning, the team did not have a unified workflow, which led to inefficient coordination.
  - When there were major changes such as source code, database, or business logic, the lack of timely communication made it difficult for members to fully understand the project flow.
  - The team did not use a task management platform, which led to forgotten tasks and missed deadlines.
  - When encountering problems, information sharing was not proactive, affecting collaboration and overall problem-solving.

- Version control:
  - This was the first time the team worked collaboratively and used Git and GitHub to manage source code.
  - Through the project, the team learned how to manage versions, collaborate, and handle conflicts during development.

- Hands-on experience:
  - When receiving the project, the team did not accurately assess the capability and workload, leading to high pressure and rushing work at the final stage.
  - The team realized the importance of synchronizing configuration files such as .env, database, as well as source code between frontend and backend.
  - On the backend side, exceptions need to be handled carefully to support debugging and improve system stability.
  - The team gained practical experience in debugging in both local and production environments for both frontend and backend.
  - Backend use cases need to be analyzed and handled carefully to avoid unexpected errors.
  - The project provided opportunities for members to explore and get familiar with many new technologies.
  - Improved self-learning ability and problem-solving skills when facing issues.

- Time management and planning throughout the development process
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