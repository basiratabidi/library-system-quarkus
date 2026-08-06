package service;

import java.util.List;
import org.library.DTO.LendingDTO;

public interface LendingService {
    List<LendingDTO> lendBook( String bookId, String memberId);
    LendingDTO returnBook(String lendingId);
    LendingDTO getLendingDetails(String lendingId);
    List<LendingDTO> getLendingsByMember(String memberId);
}