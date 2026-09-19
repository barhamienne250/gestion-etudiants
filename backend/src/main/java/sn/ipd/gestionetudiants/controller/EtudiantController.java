package sn.ipd.gestionetudiants.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.ipd.gestionetudiants.dto.EtudiantDto;
import sn.ipd.gestionetudiants.service.EtudiantService;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;

    @GetMapping
    public ResponseEntity<Page<EtudiantDto>> lister(
            @RequestParam(required = false) String recherche, Pageable pageable) {
        return ResponseEntity.ok(etudiantService.lister(recherche, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtudiantDto> obtenir(@PathVariable Long id) {
        return ResponseEntity.ok(etudiantService.obtenir(id));
    }

    @PostMapping
    public ResponseEntity<EtudiantDto> creer(@Valid @RequestBody EtudiantDto dto) {
        return ResponseEntity.ok(etudiantService.creer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtudiantDto> modifier(@PathVariable Long id, @Valid @RequestBody EtudiantDto dto) {
        return ResponseEntity.ok(etudiantService.modifier(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        etudiantService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
