package org.library.model;

import jakarta.persistence.Entity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Id;

@Entity
public class User extends PanacheEntityBase {
    @Id
    public String id;
    public String username;
    public String passwordHash;
    public String role;
}
