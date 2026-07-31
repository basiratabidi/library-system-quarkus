package org.library.model;
import jakarta.persistence.Entity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Id;

@Entity
public class Lending extends PanacheEntityBase{
    @Id
        public String id;
    public String bookId;
    public String memberId;
    public String lendingDate;
    public String returnDate;
    public boolean isReturned;
    
}
