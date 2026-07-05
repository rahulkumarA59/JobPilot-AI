# JobPilot AI Backend

Spring Boot backend skeleton for JobPilot AI.

## Stack

- Java 21
- Spring Boot 3.x
- Maven
- Spring Security
- Spring Data JPA and Hibernate
- MySQL
- Validation
- Lombok
- MapStruct
- Flyway
- Docker

## Project Status

This backend currently contains only the approved architecture skeleton:

- Package structure
- Configuration files
- Maven build
- Docker setup
- Logging configuration
- Flyway migration folder
- Email and cover letter template folders

No business logic, controllers, authentication implementation, entities, repositories, or services have been implemented.

## Local Build

```bash
mvn clean compile
```

## Docker

```bash
docker compose up --build
```
