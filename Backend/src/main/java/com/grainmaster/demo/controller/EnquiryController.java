// package com.grainmaster.demo.controller;

// import com.grainmaster.demo.dto.ApiResponse;
// import com.grainmaster.demo.dto.EnquiryRequest;
// import com.grainmaster.demo.Model.Enquiry;
// import com.grainmaster.demo.service.EnquiryService;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/enquiries")
// @RequiredArgsConstructor
// public class EnquiryController {

//     private final EnquiryService enquiryService;

//     // POST /api/enquiries          → submit new enquiry (from website form)
//     @PostMapping
//     public ResponseEntity<ApiResponse<Enquiry>> submitEnquiry(
//             @Valid @RequestBody EnquiryRequest request) {
//         Enquiry enquiry = enquiryService.submitEnquiry(request);
//         return ResponseEntity.ok(ApiResponse.ok(
//             "Enquiry submitted successfully! Our team will contact you within 24 hours.", enquiry));
//     }

//     // GET /api/enquiries           → all enquiries (admin)
//     @GetMapping
//     public ResponseEntity<ApiResponse<List<Enquiry>>> getAllEnquiries() {
//         return ResponseEntity.ok(ApiResponse.ok("Enquiries fetched", enquiryService.getAllEnquiries()));
//     }

//     // GET /api/enquiries?status=PENDING
//     @GetMapping("/status/{status}")
//     public ResponseEntity<ApiResponse<List<Enquiry>>> getByStatus(
//             @PathVariable Enquiry.EnquiryStatus status) {
//         return ResponseEntity.ok(ApiResponse.ok("Enquiries by status", enquiryService.getEnquiriesByStatus(status)));
//     }

//     // PUT /api/enquiries/{id}/status  → update status (admin)
//     @PutMapping("/{id}/status")
//     public ResponseEntity<ApiResponse<Enquiry>> updateStatus(
//             @PathVariable Long id,
//             @RequestParam Enquiry.EnquiryStatus status) {
//         Enquiry updated = enquiryService.updateStatus(id, status);
//         return ResponseEntity.ok(ApiResponse.ok("Status updated", updated));
//     }
// }


package com.grainmaster.demo.controller;
 
import com.grainmaster.demo.Config.JwtUtil;
import com.grainmaster.demo.dto.*;
import com.grainmaster.demo.Model.Enquiry;
import com.grainmaster.demo.service.EnquiryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
 
@RestController
@RequestMapping("/api/enquiries")
@RequiredArgsConstructor
public class EnquiryController {
 
    private final EnquiryService enquiryService;
    private final JwtUtil jwtUtil;
 
    @PostMapping
    public ResponseEntity<ApiResponse<Enquiry>> submit(@Valid @RequestBody EnquiryRequest req, HttpServletRequest httpReq) {
        String authHeader = httpReq.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try { req.setUserId(jwtUtil.getUserId(authHeader.substring(7))); } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(ApiResponse.ok("Enquiry submitted! We'll contact you within 24 hours.", enquiryService.submitEnquiry(req)));
    }
 
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Enquiry>>> myEnquiries(HttpServletRequest req) {
        Long userId = jwtUtil.getUserId(req.getHeader("Authorization").substring(7));
        return ResponseEntity.ok(ApiResponse.ok("Your enquiries", enquiryService.getByUserId(userId)));
    }
 
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Enquiry>>> all() {
        return ResponseEntity.ok(ApiResponse.ok("All enquiries", enquiryService.getAll()));
    }
 
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Enquiry>> updateStatus(@PathVariable Long id, @RequestParam Enquiry.EnquiryStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", enquiryService.updateStatus(id, status)));
    }
}
 
