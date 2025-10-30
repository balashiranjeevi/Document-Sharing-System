FROM openjdk:17-jdk-slim

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN apt-get update && apt-get install -y maven && \
    mvn clean package -DskipTests && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 8080

CMD ["java", "-jar", "target/springapp-0.0.1-SNAPSHOT.jar"]