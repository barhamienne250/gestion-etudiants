package sn.ipd.gestionetudiants.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> contenu;
    private int pageActuelle;
    private int totalPages;
    private long totalElements;
}
