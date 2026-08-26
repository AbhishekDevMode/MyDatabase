package com.database.mydatabase.core.storage;


import com.database.mydatabase.core.btree.BTreeNode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BTreeMetadata implements Serializable {
    private static final long serialVersionUID = 1L;

    private BTreeNode root;
    private int size;
    private long lastModified;
    private int version;

    public BTreeMetadata(BTreeNode root, int size) {
        this.root = root;
        this.size = size;
        this.lastModified = System.currentTimeMillis();
        this.version = 1;
    }
}