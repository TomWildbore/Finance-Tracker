package com.tomwildbore.financetracker.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.tomwildbore.financetracker.model.User;
import com.tomwildbore.financetracker.model.Transaction;
import com.tomwildbore.financetracker.repository.UserRepository;
import com.tomwildbore.financetracker.repository.TransactionRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public UserController(UserRepository userRepository,
                          TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping("/{userId}")
    public User getUser(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/{userId}/transactions")
    public List<Transaction> getUserTransactions(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUserId(user.getId());
    }
}