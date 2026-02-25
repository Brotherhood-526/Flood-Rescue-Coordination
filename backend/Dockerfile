# Sử dụng JDK 21 (khớp với dự án của bạn)
FROM eclipse-temurin:21-jdk-alpine

# Copy file jar vào container và đổi tên thành app.jar
# (Dấu * giúp lấy bất kỳ file jar nào trong thư mục target)
COPY target/*.jar app.jar

# Lệnh khởi chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app.jar"]