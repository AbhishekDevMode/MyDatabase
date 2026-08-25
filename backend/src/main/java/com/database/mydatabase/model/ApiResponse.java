package com.database.mydatabase.model;

public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private long timestamp;


    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> success(String message, T data) {

        return new ApiResponse<>(false, message, null, System.currentTimeMillis())
    }

}
