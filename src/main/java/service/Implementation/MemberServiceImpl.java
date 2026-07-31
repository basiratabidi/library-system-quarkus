package service.Implementation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import org.library.DTO.MemberDTO;
import org.library.exception.MemberNotFoundException;
import org.library.model.Member;

import service.MemberService;

@ApplicationScoped
public class MemberServiceImpl implements MemberService {

     @Override
    public List<MemberDTO> getAllMembers() {
        return Member.<Member>listAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional

    public MemberDTO registerMember(MemberDTO dto){
        if (dto.id !=null && !dto.id.isEmpty()){
            throw new RuntimeException("Member ID should not be provided. Will be alloted on Registraton ");
        }
        Member member= new Member();
        member.id = UUID.randomUUID().toString();
        member.name= dto.name;
        member.email= dto.email;
        member.phoneNumber=dto.phoneNumber;
        member.isActive= true;
        member.persist();
        return toDTO(member);   
    }

    @Override
    @Transactional
    public MemberDTO removeMember(String id){
        Member member = Member.findById(id);
        if (member ==null){
            throw new MemberNotFoundException("Member with ID" +id+ "doesnot exist");
        }
        MemberDTO result= toDTO(member);
        member.delete();
        return result;
    }
    
    private MemberDTO toDTO(Member member){
        MemberDTO dto= new MemberDTO();
        dto.id = member.id;
        dto.name = member.name;
        dto.email = member.email;
        dto.phoneNumber = member.phoneNumber;
        dto.isActive = member.isActive;
        return dto;      
    }
}
    // @Override
    // public MemberDTO registerMember(MemberDTO member) {
    //     if (member.id != null || !member.id.isEmpty()) {
    //            throw new RuntimeException("Member ID is required for registration.");
    //     }
    //     member.id = UUID.randomUUID().toString();
    //     members.put(member.id, member);
    //     return member;
    // }

    // @Override
    // public MemberDTO removeMember(String id) {
    //     if (!members.containsKey(id)) {
    //         throw new MemberNotFoundException("Member with ID " + id + " does not exist.");
    //     }
    //     return members.remove(id);
    // }

