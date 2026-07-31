package org.library.model;
import jakarta.persistence.Entity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Id;

@Entity
public class Book extends PanacheEntityBase {
    @Id
    public String id;
    public String title;
    public String author;
    public boolean isAvailable;
    }
