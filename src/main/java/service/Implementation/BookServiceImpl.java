package service.Implementation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import org.library.DTO.BookDTO;
import org.library.exception.BookNotFoundException;
import service.BookService;

@ApplicationScoped
public class BookServiceImpl implements BookService {
    Map<String, BookDTO> books = new HashMap<>();

    @Override
    public List<BookDTO> getAllBooks() {
        return new ArrayList<>(books.values());
    }
    @Override
    public BookDTO addBook(BookDTO book) {
        book.id = UUID.randomUUID().toString();
        book.isAvailable = true;
        books.put(book.id, book);
        return book;
    }

    @Override
    public BookDTO updateBook(String id, BookDTO book) {
    
        if (!books.containsKey(id)) {
            throw new BookNotFoundException("Book with ID " + id + " does not exist.");
        }
        book.id= id;
        books.put(book.id, book);     
        return book;    
    }
    @Override
    public BookDTO deleteBook(String id, BookDTO book) {
        if (!books.containsKey(id)) {
            throw new BookNotFoundException("Book with ID " + id + " does not exist.");
        }
        return books.remove(id);  
    }
    @Override
    public BookDTO TrackAvailability(String id) {
        BookDTO book = books.get(id);
        if (book != null) {
            book.isAvailable = !book.isAvailable;
        }   
        return book;
    }

}
