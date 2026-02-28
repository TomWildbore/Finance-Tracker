package com.tomwildbore.financetracker.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.tomwildbore.financetracker.model.User;
import com.tomwildbore.financetracker.repository.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}