package org.library.Controller;

import java.util.List;
import org.library.DTO.BookDTO;

import jakarta.ws.rs.*;
import jakarta.inject.Inject;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.BookService;


@Path("/books")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class BookController {

    @Inject 
    BookService bookService;


    @GET
    public Response getAllBoook(){
        
        List<BookDTO>books= bookService.getAllBooks();
        return Response.ok(books).build();
    }

    @POST
    public Response addBook(BookDTO book){
        BookDTO addedBook= bookService.addBook(book);
        return Response.ok(addedBook).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateBook(@PathParam("id") String id, BookDTO book){
        BookDTO updatedBook= bookService.updateBook(id, book);
        return Response.ok(updatedBook).build();        
    }

    @DELETE
    @Path("/{id}")
    public Response deleteBook(@PathParam("id") String id){
        BookDTO deletedBook= bookService.deleteBook(id);
        return Response.ok(deletedBook).build();    

    }
}
