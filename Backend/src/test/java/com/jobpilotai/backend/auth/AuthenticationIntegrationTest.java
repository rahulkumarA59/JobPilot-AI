package com.jobpilotai.backend.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthenticationIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerCreatesUser() throws Exception {
        String email = uniqueEmail();

        ResponseEntity<String> response = post("/api/auth/register", Map.of(
                "fullName", "Rahul Kumar",
                "email", email,
                "password", "Password123"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode body = json(response);
        assertThat(body.path("success").asBoolean()).isTrue();
        assertThat(body.path("data").path("email").asText()).isEqualTo(email);
        assertThat(body.path("data").path("role").asText()).isEqualTo("ROLE_USER");
    }

    @Test
    void loginReturnsAccessAndRefreshTokens() throws Exception {
        String email = uniqueEmail();
        register(email);

        ResponseEntity<String> response = post("/api/auth/login", Map.of(
                "email", email,
                "password", "Password123"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode data = json(response).path("data");
        assertThat(data.path("accessToken").asText()).isNotBlank();
        assertThat(data.path("refreshToken").asText()).isNotBlank();
        assertThat(data.path("tokenType").asText()).isEqualTo("Bearer");
    }

    @Test
    void refreshRotatesRefreshToken() throws Exception {
        String email = uniqueEmail();
        register(email);
        JsonNode loginData = login(email);
        String oldRefreshToken = loginData.path("refreshToken").asText();

        ResponseEntity<String> response = post("/api/auth/refresh", Map.of("refreshToken", oldRefreshToken));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode data = json(response).path("data");
        assertThat(data.path("accessToken").asText()).isNotBlank();
        assertThat(data.path("refreshToken").asText()).isNotBlank();
        assertThat(data.path("refreshToken").asText()).isNotEqualTo(oldRefreshToken);

        ResponseEntity<String> reusedOldTokenResponse = post("/api/auth/refresh", Map.of("refreshToken", oldRefreshToken));
        assertThat(reusedOldTokenResponse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void logoutRevokesRefreshToken() throws Exception {
        String email = uniqueEmail();
        register(email);
        JsonNode loginData = login(email);
        String refreshToken = loginData.path("refreshToken").asText();

        ResponseEntity<String> logoutResponse = post("/api/auth/logout", Map.of("refreshToken", refreshToken));

        assertThat(logoutResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        ResponseEntity<String> refreshResponse = post("/api/auth/refresh", Map.of("refreshToken", refreshToken));
        assertThat(refreshResponse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void authenticatedUserCanReadCurrentUser() throws Exception {
        String email = uniqueEmail();
        register(email);
        String accessToken = login(email).path("accessToken").asText();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        ResponseEntity<String> response = restTemplate.exchange(
                url("/api/users/me"),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(json(response).path("data").path("email").asText()).isEqualTo(email);
    }

    private void register(String email) {
        ResponseEntity<String> response = post("/api/auth/register", Map.of(
                "fullName", "Rahul Kumar",
                "email", email,
                "password", "Password123"
        ));
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    private JsonNode login(String email) throws Exception {
        ResponseEntity<String> response = post("/api/auth/login", Map.of(
                "email", email,
                "password", "Password123"
        ));
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        return json(response).path("data");
    }

    private ResponseEntity<String> post(String path, Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity(url(path), new HttpEntity<>(body, headers), String.class);
    }

    private JsonNode json(ResponseEntity<String> response) throws Exception {
        return objectMapper.readTree(response.getBody());
    }

    private String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@example.com";
    }

    private String url(String path) {
        return "http://localhost:" + port + path;
    }
}
