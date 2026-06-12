package com.grainmaster.demo.Repository;

import com.grainmaster.demo.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import java.util.List;
import java.util.Optional;
 
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerEmail(String email);
        List<Order> findByUserId(Long userId);
    List<Order> findByStatus(Order.OrderStatus status);
}
 

//ORDERREPOSITORY.JAVA
// @Repository
// public interface OrderRepository
//     extends JpaRepository<Order, Long> {
// OrderRepository declaration
// Manages the Order entity. Most queries here are user-specific — fetch orders belonging to a particular user. Admins may need to fetch all orders across all users.
//     List<Order> findByUserId(Long userId);
// Fetch all orders for a user
// Generated SQL: SELECT * FROM orders WHERE user_id = ?

// Notice: userId not user — Spring Data JPA traverses the relationship. The Order entity has a User field, and User has an id field. Spring understands findByUserId means: join to the user and filter by user.id = ?

// This is called property traversal — you can go multiple levels deep: findByUser_Address_City(String city) traverses user → address → city.
//     @Query("SELECT o FROM Order o
//             JOIN FETCH o.items i
//             JOIN FETCH i.product
//             WHERE o.user.id = :userId")
//     List<Order> findOrdersWithItemsByUserId(
//         @Param("userId") Long userId);
// Nested JOIN FETCH — load everything in one query ⭐
// This solves the N+1 problem for order history — the most common performance issue in e-commerce apps.

// Without this query, loading order history for a user with 10 orders:
// 1 query → get 10 orders
// 10 queries → get items for each order
// 10 queries → get product details for each item
// = 21 queries total

// With this JOIN FETCH:
// 1 query → gets orders + items + products all at once via JOINs
// = 1 query total

// This is the answer to "how did you fix the N+1 problem in Rice Mill" — point directly at this method.
//     List<Order> findByUserIdAndStatus(
//         Long userId, OrderStatus status);
// Filter orders by status
// Generated SQL: SELECT * FROM orders WHERE user_id = ? AND status = ?

// Used to show a user only their PENDING orders, or only DELIVERED orders. The frontend sends a status filter and the repository returns only matching orders.
//     List<Order> findByUserIdOrderByCreatedAtDesc(
//         Long userId);
// OrderBy in method name — built-in sorting
// Generated SQL: SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC

// OrderByCreatedAtDesc → ORDER BY created_at DESC (newest first)
// OrderByCreatedAtAsc → ORDER BY created_at ASC (oldest first)

// Shows the most recent orders at the top of the order history — standard UX for e-commerce order pages.
// N