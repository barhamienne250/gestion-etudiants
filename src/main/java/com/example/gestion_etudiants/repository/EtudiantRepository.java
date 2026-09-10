package com.example.gestion_etudiants.repository;

import com.example.gestion_etudiants.mode1.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
}