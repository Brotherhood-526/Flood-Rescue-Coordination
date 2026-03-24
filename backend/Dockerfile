FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw
COPY backend/src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /build/target/backend-0.0.1-SNAPSHOT.jar /app.jar
RUN chown appuser:appgroup /app.jar
USER appuser

ENTRYPOINT ["java", "-jar", "/app.jar"]