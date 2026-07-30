package service;

import java.util.List;
import org.library.DTO.MemberDTO;

public interface MemberService {
    List<MemberDTO> getAllMembers();
    MemberDTO registerMember(MemberDTO member);
    MemberDTO removeMember(MemberDTO member);
}
