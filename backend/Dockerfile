# 1. Dùng JRE để nhẹ hơn
FROM eclipse-temurin:21-jre-alpine

# 2. Tạo user phụ để bảo mật (Không dùng root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 3. Copy file JAR với tên chính xác
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# 4. Phân quyền cho user phụ
RUN chown appuser:appgroup app.jar

# 5. Chuyển sang dùng user phụ
USER appuser

# 6. Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app.jar"]