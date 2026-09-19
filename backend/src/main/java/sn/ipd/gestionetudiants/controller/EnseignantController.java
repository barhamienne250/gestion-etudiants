package sn.ipd.gestionetudiants.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.ipd.gestionetudiants.dto.EnseignantDto;
import sn.ipd.gestionetudiants.service.EnseignantService;

import java.util.List;

@RestController
@RequestMapping("/api/enseignants")
@RequiredArgsConstructor
public class EnseignantController {

    private final EnseignantService enseignantService;

    @GetMapping
    public ResponseEntity<List<EnseignantDto>> lister() {
        return ResponseEntity.ok(enseignantService.lister());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnseignantDto> obtenir(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.obtenir(id));
    }

    @PostMapping
    public ResponseEntity<EnseignantDto> creer(@Valid @RequestBody EnseignantDto dto) {
        return ResponseEntity.ok(enseignantService.creer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnseignantDto> modifier(@PathVariable Long id, @Valid @RequestBody EnseignantDto dto) {
        return ResponseEntity.ok(enseignantService.modifier(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        enseignantService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
