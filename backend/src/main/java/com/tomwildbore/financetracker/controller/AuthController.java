package com.tomwildbore.financetracker.controller;

import com.tomwildbore.financetracker.model.User;
import com.tomwildbore.financetracker.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {

        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        if (!user.get().getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user.get();
    }

    @GetMapping("/test")
    public String test() {
        return "Auth controller works";
    }
}