package org.library.Controller;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.LendingService;

import java.util.List;
import org.library.DTO.LendingDTO;
@Path("/lendings")
@Produces(MediaType.APPLICATION_JSON)   
@Consumes(MediaType.APPLICATION_JSON)

public class LendingController {

    @Inject
    LendingService lendingService;

    @POST
    @Path("/{bookId}/{memberId}")
    public Response lendBook(@PathParam("bookId") String bookId, @PathParam("memberId") String memberId) {
        List<LendingDTO> lendingDetails = lendingService.lendBook(bookId, memberId);
        return Response.ok(lendingDetails).build();
    }

    @POST
    @Path("/return/{lendingId}")
    public Response returnBook(@PathParam("lendingId") String lendingId) {
        return Response.ok(lendingService.returnBook(lendingId)).build();
    }

    @GET
    @Path("/{lendingId}")
    public Response getLendingDetails(@PathParam("lendingId") String lendingId) {
        return Response.ok(lendingService.getLendingDetails(lendingId)).build();    
    }

}
