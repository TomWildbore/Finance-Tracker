package com.tomwildbore.financetracker.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.tomwildbore.financetracker.model.Transaction;
import com.tomwildbore.financetracker.repository.TransactionRepository;
import com.tomwildbore.financetracker.service.TransactionService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public TransactionController(TransactionRepository transactionRepository,
                                 TransactionService transactionService) {
        this.transactionRepository = transactionRepository;
        this.transactionService = transactionService;
    }

    @PostMapping("/{userId}")
    public Transaction createTransaction(@PathVariable Long userId,
                                         @RequestBody Transaction transaction) {
        return transactionService.createTransaction(userId, transaction);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}