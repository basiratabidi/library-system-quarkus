package service.Implementation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import org.library.DTO.MemberDTO;
import org.library.exception.MemberNotFoundException;
import service.MemberService;

@ApplicationScoped
public class MemberServiceImpl implements MemberService {
    Map<String, MemberDTO> members = new HashMap<>();

    @Override
    public List<MemberDTO> getAllMembers() {
        if (members.isEmpty()) {
            throw new RuntimeException("No members found.");
        }
        return new ArrayList<>(members.values());
    }

    @Override
    public MemberDTO registerMember(MemberDTO member) {
        if (member.id == null || member.id.isEmpty()) {
            member.id = UUID.randomUUID().toString();
        } else {
            throw new RuntimeException("Member ID is required for registration.");
        }
        members.put(member.id, member);
        return member;
    }

    @Override
    public MemberDTO removeMember(MemberDTO member) {
        if (!members.containsKey(member.id)) {
            throw new MemberNotFoundException("Member with ID " + member.id + " does not exist.");
        }
        return members.remove(member.id);
    }
}
