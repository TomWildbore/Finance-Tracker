package com.tomwildbore.financetracker.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

import com.tomwildbore.financetracker.model.Transaction;
import com.tomwildbore.financetracker.model.User;
import com.tomwildbore.financetracker.repository.TransactionRepository;
import com.tomwildbore.financetracker.repository.UserRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public Transaction createTransaction(Long userId, Transaction transaction) {

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

        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        user.setLastActivityDate(today);

        transaction.setUser(user);

        userRepository.save(user);

        return transactionRepository.save(transaction);
    }
}