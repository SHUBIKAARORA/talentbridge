package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlacementSummaryDTO {
    private long totalStudents;
    private long placedStudents;
    private long unplacedStudents;
    private double placementPercentage;
}
