package service;

import org.library.DTO.AuthResponse;
import org.library.DTO.LoginRequest;
import org.library.DTO.SignupRequest;

public interface UserService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
}