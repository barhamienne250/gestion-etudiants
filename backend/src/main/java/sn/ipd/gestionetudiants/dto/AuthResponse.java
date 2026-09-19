package sn.ipd.gestionetudiants.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String nom;
    private String email;
    private String role;
}
