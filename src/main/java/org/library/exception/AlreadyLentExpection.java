package org.library.exception;

public class AlreadyLentExpection extends RuntimeException {
   public AlreadyLentExpection(String message) {
        super(message);
    }
}
