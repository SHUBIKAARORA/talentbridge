package com.project.talentbridge.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AddJobRequest {
    private String title;
    private String company;
    private String description;
    private String eligibilityCriteria;
    private String jdLink;
    private LocalDate lastDate;

    private List<Integer> recruiterIds;
}
