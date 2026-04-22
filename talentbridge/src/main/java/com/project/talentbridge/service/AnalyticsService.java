package com.project.talentbridge.service;

import com.project.talentbridge.dto.response.*;
import com.project.talentbridge.repository.ApplicationRepository;
import com.project.talentbridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // ✅ 1. Placement Summary
    public PlacementSummaryDTO getPlacementSummary() {
        long total = studentRepository.count();
        long placed = applicationRepository.countPlacedStudents();
        long unplaced = total - placed;

        double percentage = (total == 0) ? 0 : (placed * 100.0) / total;

        return new PlacementSummaryDTO(total, placed, unplaced, percentage);
    }

    // ✅ 2. Department-wise
    public List<DepartmentWiseDTO> getDepartmentWise() {
        return applicationRepository.getDepartmentWisePlacement()
                .stream()
                .map(obj -> new DepartmentWiseDTO((String) obj[0], (Long) obj[1]))
                .toList();
    }

    // ✅ 3. Company-wise
    public List<CompanyWiseDTO> getCompanyWise() {
        return applicationRepository.getCompanyWiseHiring()
                .stream()
                .map(obj -> new CompanyWiseDTO(
                        (String) obj[0],
                        (Long) obj[1]
                ))
                .toList();
    }

    // ✅ 4. Status
    public List<ApplicationStatusDTO> getStatusStats() {
        return applicationRepository.getStatusCounts()
                .stream()
                .map(obj -> new ApplicationStatusDTO(
                        obj[0].toString(),
                        (Long) obj[1]
                ))
                .toList();
    }

    // ✅ 5. Time Series
    public List<TimeSeriesDTO> getApplicationsOverTime() {
        return applicationRepository.getApplicationsOverTime()
                .stream()
                .map(obj -> new TimeSeriesDTO(
                        ((java.sql.Date) obj[0]).toLocalDate(),
                        (Long) obj[1]
                ))
                .toList();
    }
}
