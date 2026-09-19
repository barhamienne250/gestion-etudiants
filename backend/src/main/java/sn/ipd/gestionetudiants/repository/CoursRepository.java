package sn.ipd.gestionetudiants.repository;

import sn.ipd.gestionetudiants.model.Cours;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoursRepository extends JpaRepository<Cours, Long> {
    Page<Cours> findByIntituleContainingIgnoreCase(String intitule, Pageable pageable);
}
