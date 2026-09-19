package sn.ipd.gestionetudiants.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sn.ipd.gestionetudiants.dto.EtudiantDto;
import sn.ipd.gestionetudiants.exception.BadRequestException;
import sn.ipd.gestionetudiants.exception.ResourceNotFoundException;
import sn.ipd.gestionetudiants.model.Etudiant;
import sn.ipd.gestionetudiants.repository.EtudiantRepository;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;

    public Page<EtudiantDto> lister(String recherche, Pageable pageable) {
        Page<Etudiant> page = (recherche == null || recherche.isBlank())
                ? etudiantRepository.findAll(pageable)
                : etudiantRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(recherche, recherche, pageable);
        return page.map(this::toDto);
    }

    public EtudiantDto obtenir(Long id) {
        return toDto(trouverOuLever(id));
    }

    public EtudiantDto creer(EtudiantDto dto) {
        if (etudiantRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Un etudiant existe deja avec cet email");
        }
        Etudiant etudiant = Etudiant.builder()
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .dateNaissance(dto.getDateNaissance())
                .filiere(dto.getFiliere())
                .build();
        return toDto(etudiantRepository.save(etudiant));
    }

    public EtudiantDto modifier(Long id, EtudiantDto dto) {
        Etudiant etudiant = trouverOuLever(id);
        etudiant.setNom(dto.getNom());
        etudiant.setPrenom(dto.getPrenom());
        etudiant.setEmail(dto.getEmail());
        etudiant.setDateNaissance(dto.getDateNaissance());
        etudiant.setFiliere(dto.getFiliere());
        return toDto(etudiantRepository.save(etudiant));
    }

    public void supprimer(Long id) {
        if (!etudiantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Etudiant introuvable avec id=" + id);
        }
        etudiantRepository.deleteById(id);
    }

    private Etudiant trouverOuLever(Long id) {
        return etudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant introuvable avec id=" + id));
    }

    private EtudiantDto toDto(Etudiant e) {
        EtudiantDto dto = new EtudiantDto();
        dto.setId(e.getId());
        dto.setNom(e.getNom());
        dto.setPrenom(e.getPrenom());
        dto.setEmail(e.getEmail());
        dto.setDateNaissance(e.getDateNaissance());
        dto.setFiliere(e.getFiliere());
        return dto;
    }
}
