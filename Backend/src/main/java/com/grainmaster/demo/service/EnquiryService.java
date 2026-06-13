// package com.grainmaster.demo.service;

// import com.grainmaster.demo.dto.EnquiryRequest;
// import com.grainmaster.demo.Model.Enquiry;
// import com.grainmaster.demo.Repository.EnquiryRepository;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class EnquiryService {

//     private final EnquiryRepository enquiryRepository;
//     private final EmailService emailService;

//     public Enquiry submitEnquiry(EnquiryRequest request) {
//         Enquiry enquiry = Enquiry.builder()
//                 .customerName(request.getCustomerName())
//                 .companyName(request.getCompanyName())
//                 .email(request.getEmail())
//                 .phone(request.getPhone())
//                 .riceVariety(request.getRiceVariety())
//                 .quantityMT(request.getQuantityMT())
//                 .additionalRequirements(request.getAdditionalRequirements())
//                 .status(Enquiry.EnquiryStatus.PENDING)
//                 .build();

//         Enquiry saved = enquiryRepository.save(enquiry);
//         log.info("New enquiry saved: ID={}, Customer={}", saved.getId(), saved.getCustomerName());

//         // Send email notifications
//         emailService.sendEnquiryConfirmationToCustomer(saved);
//         emailService.sendEnquiryAlertToAdmin(saved);

//         return saved;
//     }

//     public List<Enquiry> getAllEnquiries() {
//         return enquiryRepository.findAll();
//     }

//     public List<Enquiry> getEnquiriesByStatus(Enquiry.EnquiryStatus status) {
//         return enquiryRepository.findByStatus(status);
//     }

//     public Enquiry updateStatus(Long id, Enquiry.EnquiryStatus status) {
//         Enquiry enquiry = enquiryRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Enquiry not found: " + id));
//         enquiry.setStatus(status);
//         if (status == Enquiry.EnquiryStatus.CLOSED) {
//             enquiry.setResolvedAt(LocalDateTime.now());
//         }
//         return enquiryRepository.save(enquiry);
//     }
// }


package com.grainmaster.demo.service;
 
import com.fasterxml.jackson.databind.ObjectMapper;
import com.grainmaster.demo.dto.EnquiryRequest;
import com.grainmaster.demo.Model.Enquiry;
import com.grainmaster.demo.Repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
 
import java.time.LocalDateTime;
import java.util.List;
 
@Service
@RequiredArgsConstructor
@Slf4j
public class EnquiryService {
 
    private final EnquiryRepository enquiryRepository;
    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();
 
    public Enquiry submitEnquiry(EnquiryRequest req) {
        // Join multiple varieties as comma-separated string
        String varieties = String.join(", ", req.getRiceVarieties());
 
        String quantityJson = "[]";
        if (req.getQuantityDetails() != null && !req.getQuantityDetails().isEmpty()) {
            try { quantityJson = objectMapper.writeValueAsString(req.getQuantityDetails()); }
            catch (Exception ignored) {}
        }
 
        Enquiry enquiry = Enquiry.builder()
                .userId(req.getUserId())
                .customerName(req.getCustomerName())
                .companyName(req.getCompanyName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .riceVarieties(varieties)
                .quantityDetails(quantityJson)
                .additionalRequirements(req.getAdditionalRequirements())
                .build();
 
        Enquiry saved = enquiryRepository.save(enquiry);
        log.info("Enquiry #{} saved — varieties: {}", saved.getId(), varieties);
        emailService.sendEnquiryConfirmationToCustomer(saved);
        emailService.sendEnquiryAlertToAdmin(saved);
        return saved;
    }
 
    public List<Enquiry> getAll(){
        return enquiryRepository.findAll(); 
    }
    public List<Enquiry> getByUserId(Long userId) {
        return enquiryRepository.findByUserId(userId);
    }

    public List<Enquiry> getByStatus(Enquiry.EnquiryStatus status) {
        return enquiryRepository.findByStatus(status);
    }

    public Enquiry updateStatus(Long id, Enquiry.EnquiryStatus status) {
        Enquiry e = enquiryRepository.findById(id).orElseThrow(() -> new RuntimeException("Enquiry not found"));
        e.setStatus(status);
        if (status == Enquiry.EnquiryStatus.CLOSED) e.setResolvedAt(LocalDateTime.now());
        return enquiryRepository.save(e);
    }
}
 



