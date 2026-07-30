package service;

import java.util.List;
import org.library.DTO.BookDTO;

public interface BookService {
    List<BookDTO> getAllBooks();
    BookDTO addBook(BookDTO book);
    BookDTO updateBook(String id, BookDTO book);
    BookDTO deleteBook(String id, BookDTO book);
    BookDTO TrackAvailability(String id);
}
