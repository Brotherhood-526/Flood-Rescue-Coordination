# 5. Conclusion

## 5.1 Advantages
- Clear separation between Frontend and Backend using a client–server architecture
- Used RESTful APIs 
- Effective use of Vietmap GL JS for real-time map visualization and location-based features
- Strong backend with Spring Boot the ecosystem
## 5.2 Limitations
- Deployment
- WebSocket
- Many technologies
- Automated testing
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