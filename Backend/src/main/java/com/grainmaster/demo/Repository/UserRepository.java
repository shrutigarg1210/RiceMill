package com.grainmaster.demo.Repository;

import com.grainmaster.demo.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
 
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
 

//public interface UserRepository
//     extends JpaRepository<User, Long> { }
// This one line gives you 20+ database methods for free ⭐
// JpaRepository<User, Long> means: this repository manages User entities, and the primary key type is Long.

// By extending JpaRepository, Spring Data JPA automatically provides all of these — you write zero code:

// Save: save(user), saveAll(list)
// Find: findById(id), findAll(), findAll(Pageable)
// Delete: deleteById(id), delete(user), deleteAll()
// Count: count(), existsById(id)

// Spring generates the actual SQL and implementation at runtime using Java proxies 
// — you never write a single line of SQL for these operations. The interface has no 
// implementation class — Spring creates one invisibly.
// // The hierarchy:
// // Repository (marker)
// //   └── CrudRepository (save, find, delete, count)
// //         └── PagingAndSortingRepository (+ pagination)
// //               └── JpaRepository (+ flush, batch, JPA-specific)
// Why JpaRepository and not CrudRepository?
// CrudRepository gives you basic CRUD. PagingAndSortingRepository adds pagination. 
// JpaRepository adds everything plus JPA-specific methods like saveAndFlush(),
//  deleteInBatch(), and getReferenceById().

// For most projects, JpaRepository is the right choice — it includes everything from 
// the layers above it. You'd only use CrudRepository if you specifically want to avoid
//  the JPA-specific extras (e.g. using a non-JPA store).
// @Repository
// public interface UserRepository
//     extends JpaRepository<User, Long> { }
// @Repository annotation — optional but good practice
// @Repository does two things:

// 1. Marks this interface as a Spring bean so it can be @Autowired into service classes
//@Autowired annotation in Spring Boot is used for automatic dependency injection, allowing the Spring Inversion of Control (
// IoC) container to automatically resolve and inject collaborating beans into your class
// 2. Enables Spring's exception translation — converts low-level JDBC exceptions (SQLException) into Spring's cleaner 
// DataAccessException hierarchy

// Technically, extending JpaRepository already makes Spring detect it as a bean even without @Repository. But including it 
// makes the intent explicit and enables exception translation.