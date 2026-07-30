package org.library.exception;

public class LendingNotFoundException extends RuntimeException {
    public LendingNotFoundException(String message) {
        super(message);
    }
}
