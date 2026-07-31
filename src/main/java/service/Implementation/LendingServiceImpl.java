package service.Implementation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import service.BookService;

import org.library.DTO.BookDTO;
import org.library.DTO.LendingDTO;
import org.library.exception.AlreadyLentExpection;
import org.library.exception.LendingNotFoundException;

@ApplicationScoped
public class LendingServiceImpl implements service.LendingService {
    Map <String, LendingDTO> lendings = new HashMap<>();


    @Inject
    BookService bookService;

    @Override
    public List<LendingDTO> lendBook(String bookId, String memberId) {
        BookDTO book = bookService.getBookById(bookId);

        if (!book.isAvailable){
            throw new AlreadyLentExpection("The book is Already Lend");
        }
        LendingDTO lending = new LendingDTO();
        lending.id = UUID.randomUUID().toString();
        lending.bookId = bookId;
        lending.memberId = memberId;
        lending.lendingDate = java.time.LocalDate.now().toString();
        lending.isReturned = false;
        lendings.put(lending.id, lending);
        bookService.TrackAvailability(bookId);
        
        return new ArrayList<>(lendings.values());
    }

    @Override
    public LendingDTO returnBook(String lendingId) {
        LendingDTO lending = lendings.get(lendingId);
        if (lending == null || lending.isReturned) {
            throw new LendingNotFoundException("Lending record not found or already returned.");
        }
        lending.returnDate = java.time.LocalDate.now().toString();
        lending.isReturned = true;

        bookService.TrackAvailability(lending.bookId);

        return lending;

    }

    @Override
    public LendingDTO getLendingDetails(String lendingId) {
        LendingDTO lending = lendings.get(lendingId);
        if (lending == null){
            throw new LendingNotFoundException("No Lending found");
        }
        return lending; 
    }
    
}
