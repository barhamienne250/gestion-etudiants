package sn.ipd.gestionetudiants.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InscriptionDto {
    private Long id;

    @NotNull
    private Long etudiantId;

    @NotNull
    private Long coursId;

    private String etudiantNomComplet;
    private String coursIntitule;
    private LocalDate dateInscription;
    private Double note;
}
