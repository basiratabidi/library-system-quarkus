package org.library.model;
import jakarta.persistence.Entity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Id;

@Entity
public class Member extends PanacheEntityBase {
   
    @Id
     public String id;
    public String name;
    public String email;
    public String phoneNumber;
    public boolean isActive;
    }
