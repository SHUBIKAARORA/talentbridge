package com.project.talentbridge.controller;

import com.project.talentbridge.dto.response.*;
import com.project.talentbridge.dto.response.*;
import com.project.talentbridge.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@CrossOrigin
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/placement-summary")
    public PlacementSummaryDTO getSummary() {
        return analyticsService.getPlacementSummary();
    }

    @GetMapping("/department-wise")
    public List<DepartmentWiseDTO> getDepartmentWise() {
        return analyticsService.getDepartmentWise();
    }

    @GetMapping("/company-wise")
    public List<CompanyWiseDTO> getCompanyWise() {
        return analyticsService.getCompanyWise();
    }

    @GetMapping("/status")
    public List<ApplicationStatusDTO> getStatus() {
        return analyticsService.getStatusStats();
    }

    @GetMapping("/applications-over-time")
    public List<TimeSeriesDTO> getTimeSeries() {
        return analyticsService.getApplicationsOverTime();
    }
}
