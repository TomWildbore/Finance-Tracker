package com.tomwildbore.financetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tomwildbore.financetracker.model.Transaction;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserId(Long userId);

}
