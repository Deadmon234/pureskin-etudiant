# Multi-stage build for PureSkin Étudiant application
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install

COPY frontend/ ./
RUN yarn build

# Backend build stage
FROM maven:3.8-openjdk-17 AS backend-builder

WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline

COPY backend/src ./src
RUN mvn clean package -DskipTests

# Final runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the backend JAR file
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Copy the built frontend
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-builder /app/frontend/package.json ./frontend/

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Add signal handling and debug
ENTRYPOINT ["sh", "-c", "echo 'Starting Java application...' && java -Dserver.address=0.0.0.0 -jar app.jar"]
