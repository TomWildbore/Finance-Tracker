package com.tomwildbore.financetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tomwildbore.financetracker.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}