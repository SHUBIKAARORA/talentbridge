package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;


@Data
@AllArgsConstructor
public class TimeSeriesDTO {
    private LocalDate date;
    private long count;
}
