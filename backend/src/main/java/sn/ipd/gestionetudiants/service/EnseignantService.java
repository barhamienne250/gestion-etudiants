package sn.ipd.gestionetudiants.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.ipd.gestionetudiants.dto.EnseignantDto;
import sn.ipd.gestionetudiants.exception.BadRequestException;
import sn.ipd.gestionetudiants.exception.ResourceNotFoundException;
import sn.ipd.gestionetudiants.model.Enseignant;
import sn.ipd.gestionetudiants.repository.EnseignantRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;

    public List<EnseignantDto> lister() {
        return enseignantRepository.findAll().stream().map(this::toDto).toList();
    }

    public EnseignantDto obtenir(Long id) {
        return toDto(trouverOuLever(id));
    }

    public EnseignantDto creer(EnseignantDto dto) {
        if (enseignantRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Un enseignant existe deja avec cet email");
        }
        Enseignant enseignant = Enseignant.builder()
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .specialite(dto.getSpecialite())
                .build();
        return toDto(enseignantRepository.save(enseignant));
    }

    public EnseignantDto modifier(Long id, EnseignantDto dto) {
        Enseignant enseignant = trouverOuLever(id);
        enseignant.setNom(dto.getNom());
        enseignant.setPrenom(dto.getPrenom());
        enseignant.setEmail(dto.getEmail());
        enseignant.setSpecialite(dto.getSpecialite());
        return toDto(enseignantRepository.save(enseignant));
    }

    public void supprimer(Long id) {
        if (!enseignantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enseignant introuvable avec id=" + id);
        }
        enseignantRepository.deleteById(id);
    }

    private Enseignant trouverOuLever(Long id) {
        return enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable avec id=" + id));
    }

    private EnseignantDto toDto(Enseignant e) {
        EnseignantDto dto = new EnseignantDto();
        dto.setId(e.getId());
        dto.setNom(e.getNom());
        dto.setPrenom(e.getPrenom());
        dto.setEmail(e.getEmail());
        dto.setSpecialite(e.getSpecialite());
        return dto;
    }
}
