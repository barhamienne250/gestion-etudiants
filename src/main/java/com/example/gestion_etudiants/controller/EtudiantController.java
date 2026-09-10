package com.example.gestion_etudiants.controller;

import com.example.gestion_etudiants.mode1.Etudiant;
import com.example.gestion_etudiants.service.EtudiantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "*")
public class EtudiantController {

    private final EtudiantService etudiantService;

    public EtudiantController(EtudiantService etudiantService) {
        this.etudiantService = etudiantService;
    }

    // Afficher tous les étudiants
    @GetMapping
    public List<Etudiant> getAllEtudiants() {
        return etudiantService.getAllEtudiants();
    }

    // Afficher un étudiant par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiantById(@PathVariable Long id) {
        return etudiantService.getEtudiantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Ajouter un étudiant
    @PostMapping
    public Etudiant createEtudiant(@RequestBody Etudiant etudiant) {
        return etudiantService.saveEtudiant(etudiant);
    }

    // Modifier un étudiant
    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(
            @PathVariable Long id,
            @RequestBody Etudiant etudiant) {

        return etudiantService.getEtudiantById(id)
                .map(existingEtudiant -> {
                    existingEtudiant.setNom(etudiant.getNom());
                    existingEtudiant.setPrenom(etudiant.getPrenom());
                    existingEtudiant.setEmail(etudiant.getEmail());
                    existingEtudiant.setTelephone(etudiant.getTelephone());

                    return ResponseEntity.ok(
                            etudiantService.saveEtudiant(existingEtudiant)
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Supprimer un étudiant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {

        if (etudiantService.getEtudiantById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        etudiantService.deleteEtudiant(id);
        return ResponseEntity.noContent().build();
    }
}