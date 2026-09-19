package sn.ipd.gestionetudiants.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CoursDto {
    private Long id;

    @NotBlank
    private String intitule;

    private String description;

    @NotNull
    private Integer credits;

    private Long enseignantId;
    private String enseignantNomComplet;
}
