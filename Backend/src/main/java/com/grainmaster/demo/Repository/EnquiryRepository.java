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
 
 