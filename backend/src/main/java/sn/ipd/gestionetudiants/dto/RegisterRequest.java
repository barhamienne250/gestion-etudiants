package sn.ipd.gestionetudiants.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import sn.ipd.gestionetudiants.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String nom;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caracteres")
    private String motDePasse;

    @NotBlank
    private String role; // ADMIN, ENSEIGNANT, ETUDIANT
}
