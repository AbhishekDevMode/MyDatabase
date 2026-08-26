package com.database.mydatabase.service;

import org.springframework.beans.factory.annotation.Autowired;

public class DatabaseService {

    @Autowired
    private Btree bTree;

    public Record insert(Record record) {
        log.info("Inserting record: key={,value={}",record.getKey(), record
                .getValue());
        bTree.insert;
        return record;
    }


}
