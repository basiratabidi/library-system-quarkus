package org.library.DTO;

public class SignupRequest {
    public String username;
    public String password;
    public String name;
    public String email;
    public String phoneNumber;
    public String role; //not null, either "USER" or "ADMIN"
}