package sn.ipd.gestionetudiants.repository;

import sn.ipd.gestionetudiants.model.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByEtudiantId(Long etudiantId);
    List<Inscription> findByCoursId(Long coursId);
    boolean existsByEtudiantIdAndCoursId(Long etudiantId, Long coursId);
}
