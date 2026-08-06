package org.library.Controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.library.DTO.AuthResponse;
import org.library.DTO.LoginRequest;
import org.library.DTO.SignupRequest;

import service.UserService;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

    @Inject
    UserService userService;

    @POST
    @Path("/signup")
    public Response signup(SignupRequest request) {
        AuthResponse response = userService.signup(request);
        return Response.ok(response).build();
    }

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {
        AuthResponse response = userService.login(request);
        return Response.ok(response).build();
    }
}