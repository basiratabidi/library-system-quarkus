package service.Implementation;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import service.BookService;


import org.library.DTO.BookDTO;
import org.library.DTO.LendingDTO;
import org.library.exception.AlreadyLentExpection;
import org.library.exception.LendingNotFoundException;

import org.library.model.Lending;



@ApplicationScoped
public class LendingServiceImpl implements service.LendingService {

    @Inject
    BookService bookService;

    @Override
    @Transactional
    public List<LendingDTO> lendBook(String bookId, String memberId) {
        BookDTO book = bookService.getBookById(bookId);

        if (!book.isAvailable){
            throw new AlreadyLentExpection("The book "+bookId +"is Already Lend");
        } 
        Lending lending = new Lending();
        lending.id = UUID.randomUUID().toString();
        lending.bookId = bookId;
        lending.memberId = memberId;
        lending.lendingDate = java.time.LocalDate.now().toString();
        lending.isReturned = false;
        lending.persist();
        
        bookService.TrackAvailability(bookId); 
        
        return Lending.<Lending>listAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LendingDTO returnBook(String lendingId) {
        Lending lending = Lending.findById(lendingId);
        if (lending == null || lending.isReturned) {
            throw new LendingNotFoundException("Lending record not found or already returned.");
        }
        lending.returnDate = java.time.LocalDate.now().toString();
        lending.isReturned = true;

        bookService.TrackAvailability(lending.bookId);

        return toDTO(lending);
    }

    @Override
    public LendingDTO getLendingDetails(String lendingId) {
        Lending lending = Lending.findById(lendingId);
        if (lending == null){
            throw new LendingNotFoundException("No Lending found");
        }
        return toDTO(lending); 
    }

    @Override
    public List<LendingDTO> getLendingsByMember(String memberId) {
        return Lending.<Lending>list("memberId", memberId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    private LendingDTO toDTO(Lending lending){
        LendingDTO dto = new LendingDTO();
        dto.id= lending.id;
        dto.bookId= lending.bookId;
        dto.memberId= lending.memberId;
        dto.isReturned = lending.isReturned;
        dto.returnDate = lending.returnDate;
        dto.lendingDate = lending.lendingDate;
        return dto;

    }
    
}