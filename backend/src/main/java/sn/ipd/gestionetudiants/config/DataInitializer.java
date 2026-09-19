package sn.ipd.gestionetudiants.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import sn.ipd.gestionetudiants.model.Role;
import sn.ipd.gestionetudiants.model.User;
import sn.ipd.gestionetudiants.repository.UserRepository;

/**
 * Cree un compte administrateur par defaut au premier demarrage,
 * afin de pouvoir se connecter immediatement (admin@gestion-etudiants.sn / admin123).
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@gestion-etudiants.sn";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .nom("Administrateur")
                    .email(adminEmail)
                    .motDePasse(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();
            userRepository.save(admin);
        }
    }
}
