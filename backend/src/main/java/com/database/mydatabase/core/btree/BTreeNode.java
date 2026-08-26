package com.database.mydatabase.core.btree;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BTreeNode implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<Integer> keys;
    private List<String> values;
    private List<Long> children;
    private boolean isLeaf;
    private long nodeId;

    public BTreeNode(boolean isLeaf, long nodeId) {
        this.keys = new ArrayList<>();
        this.values = new ArrayList<>();
        this.children = new ArrayList<>();
        this.isLeaf = isLeaf;
        this.nodeId = nodeId;
    }

    public boolean isFull() {
        return keys.size() >= BTreeConfig.MAX_KEYS;
    }

    public boolean isUnderflow() {
        return keys.size() < BTreeConfig.MIN_KEYS;
    }

    public boolean isEmpty() {
        return keys.isEmpty();
    }

    public int getKeyCount() {
        return keys.size();
    }

    public int getValueCount() {
        return values.size();
    }

    public int getChildCount() {
        return children.size();
    }

    // Additional helper methods
    public Integer getKeyAt(int index) {
        if (index >= 0 && index < keys.size()) {
            return keys.get(index);
        }
        return null;
    }

    public String getValueAt(int index) {
        if (index >= 0 && index < values.size()) {
            return values.get(index);
        }
        return null;
    }

    public Long getChildAt(int index) {
        if (index >= 0 && index < children.size()) {
            return children.get(index);
        }
        return null;
    }

    @Override
    public String toString() {
        return String.format("BTreeNode{id=%d, keys=%s, leaf=%s, children=%d}",
                nodeId, keys, isLeaf, children.size());
    }
}
