package service.Implementation;

import java.time.Duration;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.jwt.build.Jwt;

import org.library.DTO.AuthResponse;
import org.library.DTO.LoginRequest;
import org.library.DTO.SignupRequest;
import org.library.model.User;

import service.UserService;

@ApplicationScoped
public class UserServiceImpl implements UserService {

    @Override
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (request.username == null || request.username.isBlank() || request.password == null || request.password.isBlank()) {
            throw new WebApplicationException("Username and password are required.", Response.Status.BAD_REQUEST);
        }
        if (User.find("username", request.username).firstResultOptional().isPresent()) {
            throw new WebApplicationException("Username already taken.", Response.Status.CONFLICT);
        }

        User user = new User();
        user.id = UUID.randomUUID().toString();
        user.username = request.username;
        user.passwordHash = BcryptUtil.bcryptHash(request.password);
        user.role = "USER";
        user.persist();

        return issueToken(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = User.find("username", request.username).firstResult();
        if (user == null || !BcryptUtil.matches(request.password, user.passwordHash)) {
            throw new WebApplicationException("Invalid username or password.", Response.Status.UNAUTHORIZED);
        }
        return issueToken(user);
    }

    private AuthResponse issueToken(User user) {
        String token = Jwt.issuer("library-system")
                .upn(user.username)
                .groups(user.role)
                .expiresIn(Duration.ofHours(8))
                .sign();

        AuthResponse response = new AuthResponse();
        response.token = token;
        response.username = user.username;
        response.role = user.role;
        return response;
    }
}