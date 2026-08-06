package org.library.Controller;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.MemberService;
import jakarta.inject.Inject;
import jakarta.annotation.security.RolesAllowed;
import java.util.List;
import org.library.DTO.MemberDTO;
@Path("/members")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MemberController {

    @Inject
    MemberService memberService;

    @GET
    @RolesAllowed("ADMIN")
    public Response getAllMembers() {
        List<MemberDTO> members = memberService.getAllMembers();
        return Response.ok(members).build();
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response registerMember(MemberDTO member) {
        MemberDTO registeredMember = memberService.registerMember(member);
        return Response.ok(registeredMember).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response removeMember(@PathParam("id")String id) {
        MemberDTO removedMember = memberService.removeMember(id);
        return Response.ok(removedMember).build();
    }

    
}
