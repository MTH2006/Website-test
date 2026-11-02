FROM eclipse-temurin:21-jre

WORKDIR /app

# Install curl and kubectl for cluster operations in Demo Lab
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL -o /usr/local/bin/kubectl https://dl.k8s.io/release/v1.32.2/bin/linux/amd64/kubectl \
    && chmod +x /usr/local/bin/kubectl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY target/mini-caas-backend-1.0.0.jar app.jar

EXPOSE 8088

ENTRYPOINT ["java", "-jar", "app.jar"]

