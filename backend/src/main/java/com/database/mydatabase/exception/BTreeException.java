package com.database.mydatabase.exception;

public class BTreeException extends RuntimeException {
    public BTreeException(String message) {
        super(message);
    }

    public BTreeException(String message, Throwable cause) {
        super(message, cause);
    }
}