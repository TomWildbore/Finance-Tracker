package com.tomwildbore.financetracker.controller;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import com.tomwildbore.financetracker.model.Transaction;
import com.tomwildbore.financetracker.model.User;
import com.tomwildbore.financetracker.repository.TransactionRepository;
import com.tomwildbore.financetracker.repository.UserRepository;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository,
                                 UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{userId}")
    public Transaction createTransaction(@PathVariable Long userId,
                                        @RequestBody Transaction transaction) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = transaction.getDate();
        LocalDate lastActivity = user.getLastActivityDate();

        if (lastActivity == null) {
            user.setCurrentStreak(1);
        } else if (lastActivity.plusDays(1).equals(today)) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        } else if (!lastActivity.equals(today)) {
            user.setCurrentStreak(1);
        }

        // Update longest streak if needed
        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        user.setLastActivityDate(today);

        transaction.setUser(user);

        userRepository.save(user);

        return transactionRepository.save(transaction);
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getTransactionsByUser(@PathVariable Long userId) {
        return transactionRepository.findByUserId(userId);
    }
}