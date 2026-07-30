package service.Implementation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import org.library.DTO.LendingDTO;
import org.library.exception.LendingNotFoundException;

@ApplicationScoped
public class LendingServiceImpl implements service.LendingService {
    Map <String, LendingDTO> lendings = new HashMap<>();

    @Override
    public List<LendingDTO> lendBook(String bookId, String memberId) {
        LendingDTO lending = new LendingDTO();
        lending.id = UUID.randomUUID().toString();
        lending.bookId = bookId;
        lending.memberId = memberId;
        lending.lendingDate = java.time.LocalDate.now().toString();
        lending.isReturned = false;
        lendings.put(lending.id, lending);
        return new ArrayList<>(lendings.values());
    }
    @Override
    public LendingDTO returnBook(String lendingId) {
        LendingDTO lending = lendings.get(lendingId);
        if (lending != null && !lending.isReturned) {
            lending.returnDate = java.time.LocalDate.now().toString();
            lending.isReturned = true;
        }
        else {
            throw new LendingNotFoundException("Lending record not found or already returned.");
        }
        return lending;
    }

    @Override
    public LendingDTO getLendingDetails(String lendingId) {
        return lendings.get(lendingId);
    }
    
}
