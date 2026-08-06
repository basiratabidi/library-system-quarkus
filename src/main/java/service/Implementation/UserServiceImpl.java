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
import org.library.model.Member;

import service.UserService;

@ApplicationScoped
public class UserServiceImpl implements UserService {

    @Override
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (request.username == null || request.username.isBlank() || request.password == null || request.password.isBlank()) {
            throw new WebApplicationException("Username and password are required.", Response.Status.BAD_REQUEST);
        }
        if (Member.find("username", request.username).firstResultOptional().isPresent()) {
            throw new WebApplicationException("Username already taken.", Response.Status.CONFLICT);
        }

        String role = "ADMIN".equalsIgnoreCase(request.role) ? "ADMIN" : "USER";

        Member member = new Member();
        member.id = UUID.randomUUID().toString();
        member.username = request.username;
        member.passwordHash = BcryptUtil.bcryptHash(request.password);
        member.role = role;
        member.name = request.name != null && !request.name.isBlank() ? request.name : request.username;
        member.email = request.email;
        member.phoneNumber = request.phoneNumber;
        member.isActive = true;
        member.persist();

        return issueToken(member);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Member member = Member.find("username", request.username).firstResult();
        if (member == null || member.passwordHash == null || !BcryptUtil.matches(request.password, member.passwordHash)) {
            throw new WebApplicationException("Invalid username or password.", Response.Status.UNAUTHORIZED);
        }
        return issueToken(member);
    }

    private AuthResponse issueToken(Member member) {
        String token = Jwt.issuer("library-system")
                .upn(member.username)
                .subject(member.id)
                .groups(member.role)
                .expiresIn(Duration.ofHours(8))
                .sign();

        AuthResponse response = new AuthResponse();
        response.token = token;
        response.username = member.username;
        response.role = member.role;
        return response;
    }
}