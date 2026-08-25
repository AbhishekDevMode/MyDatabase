package com.database.mydatabase.model;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Record {

    @NotNull(message = "Key cannot be null")
    @Min(value = 0, message = "Please enter positive key")
    private Integer key;

    @NotBlank(message="Value cannot be blank")
    private String value;

    private Long timestamp;
    private String operation;

    public Record(Integer key,String value){
        this.key=key;
        this.value=value;
        this.timestamp=System.currentTimeMillis();
    }
}



