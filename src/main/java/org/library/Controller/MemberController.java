package org.library.Controller;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.MemberService;
import jakarta.inject.Inject;

import java.util.List;
import org.library.DTO.MemberDTO;
@Path("/members")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MemberController {

    @Inject
    MemberService memberService;

    @GET
    public Response getAllMembers() {
        List<MemberDTO> members = memberService.getAllMembers();
        return Response.ok(members).build();
    }

    @POST
    public Response registerMember(MemberDTO member) {
        MemberDTO registeredMember = memberService.registerMember(member);
        return Response.ok(registeredMember).build();
    }

    @DELETE
    public Response removeMember(MemberDTO member) {
        MemberDTO removedMember = memberService.removeMember(member);
        return Response.ok(removedMember).build();
    }

    
}
