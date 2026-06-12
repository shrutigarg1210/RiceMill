//DAO - Data Access Object-> methods which are used to interact with DB. @Repository

// The Repository layer is where your Java code talks to the MySQL database. 
// You write zero SQL for basic operations — Spring Data JPA generates it automatically.
//  You only write queries for custom needs. 
// This layer sits between the Service layer (business logic) and the database.

package com.grainmaster.demo.Repository;


import com.grainmaster.demo.Model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import java.util.List;
 
@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByStatus(Enquiry.EnquiryStatus status);
    List<Enquiry> findByEmail(String email);
    List<Enquiry> findByUserId(Long userId);
    // List<Enquiry> findByRiceVariety(String riceVariety);
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
// 2. Enables Spring's exception translation — converts low-level JDBC exceptions (SQLException) into Spring's cleaner 
// DataAccessException hierarchy

// Technically, extending JpaRepository already makes Spring detect it as a bean even without @Repository. But including it 
// makes the intent explicit and enables exception translation.


// Custom query 
// @Repository
// public interface UserRepository extends JpaRepository<User, Long> {

//     List<User> findByNameStartingWith(String prefix);

// }
// Usage:
// List<User> users = userRepository.findByNameStartingWith("A");
// This generates a query similar to:
// SELECT * FROM users
// WHERE name LIKE 'A%';
// Case-insensitive search
// If you want names starting with A or a:
// List<User> findByNameStartingWithIgnoreCase(String prefix);
// Usage:
// List<User> users = userRepository.findByNameStartingWithIgnoreCase("A");
// Alternative with LIKE
// You can also write a custom query:
// @Query("SELECT u FROM User u WHERE u.name LIKE CONCAT(:prefix, '%')")
// List<User> findUsersByNamePrefix(@Param("prefix") String prefix);
// But for this use case, findByNameStartingWith(...) is the simplest and most idiomatic Spring Data JPA approach.
// Some common keywords:
// Method	Generated Query
// findByName	WHERE name = ?
// findByNameIgnoreCase	WHERE LOWER(name) = LOWER(?)
// findByNameStartingWith	WHERE name LIKE ?%
// findByNameEndingWith	WHERE name LIKE %?
// findByNameContaining	WHERE name LIKE %?%
// findByAgeGreaterThan	WHERE age > ?
// findByAgeLessThan	WHERE age < ?
// findByNameAndEmail	WHERE name = ? AND email = ?
// findByNameOrEmail	WHERE name = ? OR email = ?

// If you want "R" to appear somewhere in the middle, but not at the beginning and not at the end, Spring Data JPA doesn't have a built-in keyword for that specific pattern.
// You'll need a custom query:
// @Query("SELECT u FROM User u WHERE u.name LIKE '%R%' AND u.name NOT LIKE 'R%' AND u.name NOT LIKE '%R'")
// List<User> findNamesWithRInMiddle();