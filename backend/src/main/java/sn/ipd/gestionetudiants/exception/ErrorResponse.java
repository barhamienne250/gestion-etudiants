package sn.ipd.gestionetudiants.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime horodatage;
    private int statut;
    private String message;
    private Map<String, String> erreursValidation;
}
