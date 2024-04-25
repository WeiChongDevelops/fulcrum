FROM openjdk:11-jre
WORKDIR /app
COPY ./build/libs/*-all.jar app.jar
EXPOSE 8080
CMD ["java", "-Djava.awt.headless=true", "-jar", "app.jar"]
