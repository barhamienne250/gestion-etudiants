package sn.ipd.gestionetudiants.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "enseignants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enseignant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private String specialite;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
