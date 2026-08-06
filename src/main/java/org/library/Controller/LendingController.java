package org.library.Controller;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import service.LendingService;

import java.util.List;
import org.library.DTO.LendingDTO;
@Path("/lendings")
@Produces(MediaType.APPLICATION_JSON)   
@Consumes(MediaType.APPLICATION_JSON)

public class LendingController {

    @Inject
    LendingService lendingService;

    @Inject
    JsonWebToken jwt;

    @POST
    @Path("/{bookId}/{memberId}")
    @RolesAllowed("ADMIN")
    public Response lendBook(@PathParam("bookId") String bookId, @PathParam("memberId") String memberId) {
        List<LendingDTO> lendingDetails = lendingService.lendBook(bookId, memberId);
        return Response.ok(lendingDetails).build();
    }

    @POST
    @Path("/self/{bookId}")
    @RolesAllowed({"ADMIN", "USER"})
    public Response lendBookSelf(@PathParam("bookId") String bookId) {
        String memberId = jwt.getSubject();
        List<LendingDTO> lendingDetails = lendingService.lendBook(bookId, memberId);
        return Response.ok(lendingDetails).build();
    }

    @POST
    @Path("/return/{lendingId}")
    @RolesAllowed("ADMIN")
    public Response returnBook(@PathParam("lendingId") String lendingId) {
        return Response.ok(lendingService.returnBook(lendingId)).build();
    }

    @GET
    @Path("/mine")
    @RolesAllowed({"ADMIN", "USER"})
    public Response getMyLendings() {
        String memberId = jwt.getSubject();
        return Response.ok(lendingService.getLendingsByMember(memberId)).build();
    }

    @GET
    @Path("/{lendingId}")
    @RolesAllowed({"ADMIN", "USER"})
    public Response getLendingDetails(@PathParam("lendingId") String lendingId) {
        return Response.ok(lendingService.getLendingDetails(lendingId)).build();    
    }

}