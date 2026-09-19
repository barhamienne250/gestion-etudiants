package sn.ipd.gestionetudiants.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sn.ipd.gestionetudiants.dto.CoursDto;
import sn.ipd.gestionetudiants.exception.ResourceNotFoundException;
import sn.ipd.gestionetudiants.model.Cours;
import sn.ipd.gestionetudiants.model.Enseignant;
import sn.ipd.gestionetudiants.repository.CoursRepository;
import sn.ipd.gestionetudiants.repository.EnseignantRepository;

@Service
@RequiredArgsConstructor
public class CoursService {

    private final CoursRepository coursRepository;
    private final EnseignantRepository enseignantRepository;

    public Page<CoursDto> lister(String recherche, Pageable pageable) {
        Page<Cours> page = (recherche == null || recherche.isBlank())
                ? coursRepository.findAll(pageable)
                : coursRepository.findByIntituleContainingIgnoreCase(recherche, pageable);
        return page.map(this::toDto);
    }

    public CoursDto obtenir(Long id) {
        return toDto(trouverOuLever(id));
    }

    public CoursDto creer(CoursDto dto) {
        Cours cours = Cours.builder()
                .intitule(dto.getIntitule())
                .description(dto.getDescription())
                .credits(dto.getCredits())
                .enseignant(resoudreEnseignant(dto.getEnseignantId()))
                .build();
        return toDto(coursRepository.save(cours));
    }

    public CoursDto modifier(Long id, CoursDto dto) {
        Cours cours = trouverOuLever(id);
        cours.setIntitule(dto.getIntitule());
        cours.setDescription(dto.getDescription());
        cours.setCredits(dto.getCredits());
        cours.setEnseignant(resoudreEnseignant(dto.getEnseignantId()));
        return toDto(coursRepository.save(cours));
    }

    public void supprimer(Long id) {
        if (!coursRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cours introuvable avec id=" + id);
        }
        coursRepository.deleteById(id);
    }

    private Enseignant resoudreEnseignant(Long enseignantId) {
        if (enseignantId == null) return null;
        return enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable avec id=" + enseignantId));
    }

    private Cours trouverOuLever(Long id) {
        return coursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable avec id=" + id));
    }

    private CoursDto toDto(Cours c) {
        CoursDto dto = new CoursDto();
        dto.setId(c.getId());
        dto.setIntitule(c.getIntitule());
        dto.setDescription(c.getDescription());
        dto.setCredits(c.getCredits());
        if (c.getEnseignant() != null) {
            dto.setEnseignantId(c.getEnseignant().getId());
            dto.setEnseignantNomComplet(c.getEnseignant().getPrenom() + " " + c.getEnseignant().getNom());
        }
        return dto;
    }
}
