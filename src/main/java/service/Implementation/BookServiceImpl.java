package service.Implementation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import org.library.DTO.BookDTO;
import org.library.exception.BookNotFoundException;

import service.BookService;
import org.library.model.Book;

@ApplicationScoped
public class BookServiceImpl implements BookService {

    @Override
    public List<BookDTO> getAllBooks() {
       return Book.<Book>listAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookDTO addBook(BookDTO dto) {

        Book books = new Book();
        books.id= UUID.randomUUID().toString();
        books.title= dto.title;
        books.author= dto.author;
        books.persist();
        books.isAvailable= true;

        return toDTO(books);
    }

    @Override
    @Transactional
    public BookDTO updateBook(String id, BookDTO dto) {
        Book books = Book.findById(id);
        if (books == null) {
            throw new BookNotFoundException("Book with ID " + id + " does not exist.");
        }
        books.title= dto.title;
        books.author= dto.author;
        return toDTO(books);    
    }

    @Override
    @Transactional
    public BookDTO deleteBook(String id) {
       Book books = Book.findById(id);
        if (books == null) {
            throw new BookNotFoundException("Book with ID " + id + " does not exist.");
        }
        BookDTO result =toDTO(books);
        books.delete();  
        return result;
    }

    @Override
    @Transactional
    public BookDTO TrackAvailability(String id) {
        Book book = Book.findById(id);
        if (book == null) {
            throw new BookNotFoundException("book with ID"+id+"not Found");
        }   
        book.isAvailable= !book.isAvailable;
        return toDTO(book);
    }
    @Override
    @Transactional
    public BookDTO getBookById(String id) {
        Book book = Book.findById(id);
        if (book == null) {
            throw new BookNotFoundException("Book with ID " + id + " does not exist.");
        }
        return toDTO(book);
    }

    private BookDTO toDTO(Book book){
        BookDTO dto = new BookDTO();
        dto.id = book.id;
        dto.title = book.title;
        dto.author= book.author;
        dto.isAvailable = book.isAvailable;
        return dto;
    }

}
