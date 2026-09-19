package sn.ipd.gestionetudiants.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.ipd.gestionetudiants.dto.InscriptionDto;
import sn.ipd.gestionetudiants.service.InscriptionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inscriptions")
@RequiredArgsConstructor
public class InscriptionController {

    private final InscriptionService inscriptionService;

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<InscriptionDto>> listerParEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(inscriptionService.listerParEtudiant(etudiantId));
    }

    @GetMapping("/cours/{coursId}")
    public ResponseEntity<List<InscriptionDto>> listerParCours(@PathVariable Long coursId) {
        return ResponseEntity.ok(inscriptionService.listerParCours(coursId));
    }

    @PostMapping
    public ResponseEntity<InscriptionDto> inscrire(@Valid @RequestBody InscriptionDto dto) {
        return ResponseEntity.ok(inscriptionService.inscrire(dto));
    }

    @PatchMapping("/{id}/note")
    public ResponseEntity<InscriptionDto> noter(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(inscriptionService.noter(id, body.get("note")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> annuler(@PathVariable Long id) {
        inscriptionService.annuler(id);
        return ResponseEntity.noContent().build();
    }
}
