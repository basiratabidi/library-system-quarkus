package service.Implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import client.GoogleBooksService;
import org.library.DTO.BookDTO;
import org.library.exception.BookNotFoundException;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.event.Observes;
import java.util.concurrent.ScheduledExecutorService;

import service.BookService;
import org.library.model.Book;

@ApplicationScoped
public class BookServiceImpl implements BookService {

    private static final ExecutorService COVER_FETCH_POOL = Executors.newFixedThreadPool(8);
    private static final ScheduledExecutorService RETRY_SCHEDULER = Executors.newSingleThreadScheduledExecutor();
    
    @Inject
    GoogleBooksService googleBooksService;

    @Override
    public List<BookDTO> getAllBooks() {
        List<Book> books = Book.listAll();

        List<CompletableFuture<String>> coverFutures = books.stream()
                .map(book -> book.coverUrl != null
                        ? CompletableFuture.completedFuture(book.coverUrl)
                        : CompletableFuture
                                .supplyAsync(() -> googleBooksService.fetchCoverUrl(book.title, book.author), COVER_FETCH_POOL)
                                .completeOnTimeout(null, 5, TimeUnit.SECONDS))
                .collect(Collectors.toList());

        List<BookDTO> result = new ArrayList<>();
        for (int i = 0; i < books.size(); i++) {
            Book book = books.get(i);
            String coverUrl = coverFutures.get(i).join();
            if (book.coverUrl == null) {
                persistCoverUrl(book.id, coverUrl);
            }
            result.add(toDTO(book, coverUrl));
        }
        return result;
    }
   
    void onStart(@Observes StartupEvent ev) {
    RETRY_SCHEDULER.scheduleWithFixedDelay(this::retryBlankCovers, 2, 2, TimeUnit.SECONDS);
    }

    @Transactional
    public void retryBlankCovers() {
        List<Book> blanks = Book.find("coverUrl", "").list();
            for (Book book : blanks) {
                String url = googleBooksService.fetchCoverUrl(book.title, book.author);
                if (url != null) {
                    book.coverUrl = url;
                }
            }
        }

    @Transactional
    protected void persistCoverUrl(String bookId, String coverUrl) {
        Book book = Book.findById(bookId);
        if (book != null) {
            book.coverUrl = coverUrl != null ? coverUrl : "";
        }
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
        if (book.coverUrl == null) {
            String url = googleBooksService.fetchCoverUrl(book.title, book.author);
            book.coverUrl = url != null ? url : "";
        }
        return toDTO(book, book.coverUrl);
    }

    private BookDTO toDTO(Book book, String coverUrl){
        BookDTO dto = new BookDTO();
        dto.id = book.id;
        dto.title = book.title;
        dto.author= book.author;
        dto.isAvailable = book.isAvailable;
        dto.coverUrl = coverUrl;
        return dto;
    }

}