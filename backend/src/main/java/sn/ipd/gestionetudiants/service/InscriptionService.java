package sn.ipd.gestionetudiants.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.ipd.gestionetudiants.dto.InscriptionDto;
import sn.ipd.gestionetudiants.exception.BadRequestException;
import sn.ipd.gestionetudiants.exception.ResourceNotFoundException;
import sn.ipd.gestionetudiants.model.Cours;
import sn.ipd.gestionetudiants.model.Etudiant;
import sn.ipd.gestionetudiants.model.Inscription;
import sn.ipd.gestionetudiants.repository.CoursRepository;
import sn.ipd.gestionetudiants.repository.EtudiantRepository;
import sn.ipd.gestionetudiants.repository.InscriptionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final EtudiantRepository etudiantRepository;
    private final CoursRepository coursRepository;

    public List<InscriptionDto> listerParEtudiant(Long etudiantId) {
        return inscriptionRepository.findByEtudiantId(etudiantId).stream().map(this::toDto).toList();
    }

    public List<InscriptionDto> listerParCours(Long coursId) {
        return inscriptionRepository.findByCoursId(coursId).stream().map(this::toDto).toList();
    }

    public InscriptionDto inscrire(InscriptionDto dto) {
        Etudiant etudiant = etudiantRepository.findById(dto.getEtudiantId())
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant introuvable avec id=" + dto.getEtudiantId()));
        Cours cours = coursRepository.findById(dto.getCoursId())
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable avec id=" + dto.getCoursId()));

        if (inscriptionRepository.existsByEtudiantIdAndCoursId(etudiant.getId(), cours.getId())) {
            throw new BadRequestException("Cet etudiant est deja inscrit a ce cours");
        }

        Inscription inscription = Inscription.builder()
                .etudiant(etudiant)
                .cours(cours)
                .build();

        return toDto(inscriptionRepository.save(inscription));
    }

    public InscriptionDto noter(Long id, Double note) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable avec id=" + id));
        inscription.setNote(note);
        return toDto(inscriptionRepository.save(inscription));
    }

    public void annuler(Long id) {
        if (!inscriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inscription introuvable avec id=" + id);
        }
        inscriptionRepository.deleteById(id);
    }

    private InscriptionDto toDto(Inscription i) {
        InscriptionDto dto = new InscriptionDto();
        dto.setId(i.getId());
        dto.setEtudiantId(i.getEtudiant().getId());
        dto.setCoursId(i.getCours().getId());
        dto.setEtudiantNomComplet(i.getEtudiant().getPrenom() + " " + i.getEtudiant().getNom());
        dto.setCoursIntitule(i.getCours().getIntitule());
        dto.setDateInscription(i.getDateInscription());
        dto.setNote(i.getNote());
        return dto;
    }
}
