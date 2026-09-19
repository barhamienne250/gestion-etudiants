package sn.ipd.gestionetudiants.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.ipd.gestionetudiants.dto.CoursDto;
import sn.ipd.gestionetudiants.service.CoursService;

@RestController
@RequestMapping("/api/cours")
@RequiredArgsConstructor
public class CoursController {

    private final CoursService coursService;

    @GetMapping
    public ResponseEntity<Page<CoursDto>> lister(
            @RequestParam(required = false) String recherche, Pageable pageable) {
        return ResponseEntity.ok(coursService.lister(recherche, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoursDto> obtenir(@PathVariable Long id) {
        return ResponseEntity.ok(coursService.obtenir(id));
    }

    @PostMapping
    public ResponseEntity<CoursDto> creer(@Valid @RequestBody CoursDto dto) {
        return ResponseEntity.ok(coursService.creer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoursDto> modifier(@PathVariable Long id, @Valid @RequestBody CoursDto dto) {
        return ResponseEntity.ok(coursService.modifier(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        coursService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
