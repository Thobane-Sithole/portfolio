# ---- 1. Build the Angular front-end -------------------------------------
FROM node:20-alpine AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npx ng build

# ---- 2. Build the Spring Boot jar with the Angular files inside ---------
FROM maven:3.9-eclipse-temurin-21 AS api
WORKDIR /api
COPY backend/pom.xml .
RUN mvn -B -q dependency:go-offline
COPY backend/src ./src
# Spring Boot serves anything in resources/static at the site root
COPY --from=web /web/dist/portfolio-web/ ./src/main/resources/static/
RUN mvn -B -q package

# ---- 3. Small runtime image ----------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=api /api/target/portfolio.jar app.jar
USER app
# Render's free plan has 512 MB of RAM; keep the JVM inside it
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -Xss512k"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
