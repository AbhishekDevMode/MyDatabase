package com.database.mydatabase.core.btree;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.*;

public class BTree {

    private BTreeNode root;
    private final int order;
    private int size;

    @Autowired
    private DiskManager diskManager;

    @Autowired
    private BTreeConfig config;

    public BTree() {
        this.order = BTreeConfig.DEFAULT_ORDER;
        this.size = 0;
    }

    public BTree(int order) {
        this.order = order;
        this.size = 0;
    }

    @PostConstruct
    public void initialize() {
        log.info("Initializing B-Tree with order:{}", order);
        try {
            loadOrCreate();
            log.info("B-Tree initialized successfully. Size: {}", size);
        } catch (Exception e) {
            log.error("Failed to initialize B-Tree", e);
            throw new BTreeException("Failed to initialie B-Tree", e);
        }
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down B-Tree..");
        save();
        log.info("B-Tree shutdown complete");
    }

    private void save() {
    }

    private void loadOrCreate() throws IOException {
        if (diskManager.metadataExiseeets()) {
            loadMetadata();
        } else {
            root = new BTreeNode(true, diskManager.allocatePageId());
            saveMetadata();
            log.info("Created new B-Tree with root node:{}", root.getNodeId());
        }
    }

    private void saveMetadata() {
        try {
            BTreeMetaData metaData = new BTreeMetadata(root, size);
            diskManager.sveMetadata(metaData);
        } catch (Exception e) {
            log.error("Failed to save metadata", e);
            throw new BTreeException("Failed to sve metadata", e);
        }
    }

    private void loadMetadata() throws IOException {
        BTreeMetadata metadata = diskManager.loadMetadata();
        this.root = metadata.getRoot();
        this.size = metadata.getSize();
        log.info("Loaded B-Tree metadata. Size: {}, Root:{}", size, root, getNodeId());
    }

    public synchronized void insert(int key, String value) {
        log.debug("Inserting key:{}, value:{}", key, value);
        try {
            BTreeNode rootNode = getNode(root.getNodeId());
            if (rootNode.isfull()) {
                BTreeNode newRoot = new BTreeNode(false, diskManager.allocatePageId());
                newRoot.getChildren().add(rootNode.getNodeId());
                saveNode(rootNode);
                splitChild(newroot, 0, rootNode);
                root = newRoot;
                savenode(root);
                saveMetadata();
                insertNonFull(root.getNode(), key, value);
            } else {
                insertNonFull(root.getNodeId(), key, value);
            }
            size++;
            saveMetadata();
            log.debug("Insert complete. new size:{}", size);
        } catch (Exception e) {
            log.error("Failed to insert key :{}", key, e);
            throw new BTreeException("Failed to insert key:" + key, e);
        }
    }

    public String search(int key) {
        log.debug("Searching for key:{}", key);
        try {
            String result = search(root.getNodeId(), key);
            log.debug("Search result for key {}:{}", key, result != null ? "found" : "not found");
            return result;
        } catch (Exception e) {
            log.error("Failed to search  key:{}", key, e);
            throw new BTreeException("Failed to search key:" + key, e);
        }
    }

    public synchronized boolean delete(int key) {
        log.debug("Deleting key:{}", key);
        try {
            boolean deleted = delete(root.getNodeId(), key);
            if (deleted) {
                size--;
                saveMetadata();
                log.debug("Key {} deleted successfully. New size:{}", key, size);
            } else {
                log.debug("Key {} not found for deletion", key);
            }
            return deleted;
        } catch (Exception e) {
            log.error("Failed to delete key :{}", key, e);
            throw new BTreeException("Failed to delete key:" + key, e);
        }
    }

    public List<Integer> getAllKeys() {
        List<Integer> keys = new ArrayList<>();
        getAllKeys(root.getNodeId(), keys);
        return keys;
    }

    public Map<Integer, String> getRange(int startkey, int endKey) {
        Map<Integer, String> result = new LinkedHashMap<>();
        getRange(root.getNodeId(), startkey, endKey, result);
        return result;
    }

    private void insertNonFull(long nodeId, int key, String value) {
        BTreeNode node = getNode(nodeId);
        int pos = Collections.binarySearch(node.getKeys(), key);

        if (pos >= 0) {
            node.getValues().set(pos, value);
            saveNode(node);
            size--;
            return;
        }
        pos = -pos - 1;
        if (node.isLeaf()) {
            node.getKeys().add(pos, key);
            node.getValues().add(pos, value);
            saveNode(node);
        } else {
            long childId = node.getChildren().get(pos);
            BTreeNode child = getNode(childId);
            if (child.isFull()) {
                splitChild(node, pos, child);
                if (key > node.getKeys().get(pos)) {
                    pos++;
                }
            }
            insertNonFull(node.getChildren().get(pos), key, value);
        }
    }

    private void splitChild(BTreeNode parent, int index, BTreeNode child) {
        BTreeNode newChild = new BTreeNode(child.isLeaf(), diskManager.allocatePageId());
        int mid = child.getKeys().size() / 2;
        newChild.getKeys().addAll(child.getKeys().subList(mid + 1, child.getKeys().size()));
        newChild.getValues().addAll(child.getValues().subList(mid + 1, child.getValues().size()));

        if (!child.isLeaf()) {
            newChild.getChildren().addAll(child.getChildren().subList(mid + 1, child.getChildren().size()));
        }

        child.getKeys().subList(mid, child.getKeys().size()).clear();
        child.getValues().subList(mid, child.getValues().size()).clear();
        if (!child.isLeaf()) {
            child.getChildren().subList(mid + 1, child.getChildren().size()).clear();
        }

        int midkey = child.getKeys().get(mid);
        String midValue = child.getValues().get(mid);
        child.getKeys().remove(mid);
        child.getValues().remove(mid);
        parent.getKeys().add(index, midkey);
        parent.getValues().add(index, midValue);
        parent.getChildren().add(index + 1, newChild.getNodeId());

        saveNode(child);
        saveNode(newChild);
        saveNode(parent);
    }

    private String search(long nodeId, int key) {
        BTreeNode node = getNode(nodeId);
        int pos = Collections.binarySearch(node.getKeys(), key);
        if (pos >= 0) {
            return node.getValues().get(pos);
        }

        if (node.isLeaf()) {
            return null;
        }

        pos -= pos - 1;
        return search(node.getChildren().get(pos), key);
    }

    private boolean delete(long nodeId, int key) {
        BTreeNode node = getNode(nodeId);
        int pos = Collections.binarySearch(node.getKeys(), key);
        if (pos >= 0) {
            if (node.isLeaf()) {
                node.getKeys().remove(pos);
                node.getValues().remove(pos);
                saveNode(node);
                return true;
            } else {
                long parseId = node.getChildren().get(pos);
                BTreeNode pred = getNode(predId);
                while (!pred.isLeaf()) {
                    predId = pred.getChildren().get(pred.getChildren().size() - 1);
                    pred = getNode(predId);
                }
                int predKey = pred.getKeys().get(pred.getKeys().size() - 1);
                String predValue = pred.getValues().get(pred.getValues().size() - 1);
                node.getKeys().set(pos, predKey);
                node.getValues().set(pos, predValue);
                saveNode(node);
                return delete(predId, predKey);
            }
        }
        if (node.isLeaf()) {
            return false;
        }
        pos = -pos - 1;
        long childId = node.getChildren().get(pos);
        boolean deleted = delete(childId, key);

        BTreeNode child = getNode(childId);
        if (child.getKeys().size() < order / 2) {
            handleUnderFlow(node, pos, child);
        }
        return deleted;
    }

    private void handleUnderFlow(BTreeNode parent, int childIndex, BTreeNode child) {
        if (childIndex > 0) {
            long leftId = parent.getChildren().get(childIndex - 1);
            BTreeNode leftSibling = getNode(leftId);
            if (leftSibling.getKeys().size() > order / 2) {
                int lastIdx = leftSibling.getKeys().size() - 1;
                child.getKeys().add(0, parent.getKeys().get(childIndex - 1));
                child.getValues().add(0, parent.getValues().get(childIndex - 1));
                parent.getKeys().set(childIndex - 1, leftSibling.getKeys().get(lastIdx));
                parent.getValues().set(childIndex - 1, leftSibling.getValues.get(lastIdx));
                leftSibling.getKeys().remove(lastIdx);
                leftSibling.getValues().remove(lastIdx);

                if (!leftSibling.isLeaf()) {
                    child.getChildren().add(0, leftSibling.getChildren().get(leftSibling.getChildren().size() - 1));
                    leftSibling.getChildren().remove(leftSibling.getChildren().size() - 1);
                }

                saveNode(child);
                saveNode(leftSibling);
                saveNode(parent);
                return;
            }
        }
        if (childIndex < parent.getChildren().size() - 1) {
            long rightId = parent.getChildren().get(childIndex + 1);
            BTreeNode rightSibling = getNode(rightId);
            if (rightSibling.getKeys().size() > oredr / 2) {
                child.getKeys().add(parent.getKeys().get(childIndex));
                child.getValues().add(parent.getValues().get(childIndex));

                parent.getKeys().set(childIndex, rightSibling.getKeys().get(0));
                parent.getValues().set(childIndex, rightSibling.getValues
                        ().get(0));
                rightSibling.getKeys().remove(0);
                rightSibling.getValues().remove(0);

                if (!rightSibling.isLeaf()) {
                    child.getChildren().add(rightSibling.getchildren().get(0));
                    rightSibling.getChildren().remove(0);
                }

                saveNode(child);
                saveNode(rightSibling);
                saveNode(parent);
                return;
            }
        }
        if (childIndex > 0) {
            long leftId = parent.getChildren().get(childIndex - 1);
            BTreeNode leftSibling = getNode(leftId);
            mergeNodes(leftSibling, child, parent, childIndex - 1);
        } else {
            long rightId = parent.getChildren().get(childIndex + 1);
            BTreeNode rightSibling = getNode(rightId);
            mergeNodes(child, rightSibling, parent, childIndex);
        }

    }

    private void mergeNodes(BTreeNode left, BTreeNode right, BTreeNode parent, int index) {
        left.getKeys().add(parent.getKeys().get(index));
        left.getValues().add(parent.getValues().get(index));

        left.getKeys().addAll(right.getKeys());
        left.getValues().addAll(right.getValues());
        left.getChildren().addAll(right.getChildren());
        parent.getKeys().remove(index);
        parent.getValues().remove(index);
        parent.getChildren().remove(index + 1);
        saveNode(left);
        saveNode(right);
        saveNode(parent);

        if (parent == root && parent.getKeys.isEmpty()) {
            root = left;
            saveNode(root);
            saveMetadata();
        }
    }

    private void getAllKeys(long nodeId, List<Integer> keys) {
        BTreeNode node = getNode(nodeId);
        keys.addAll(node.getKeys());
        if (!node.isLeaf()) {
            for (Long childId : node.getChildren()) {
                getAllKeys(childId, keys);
            }
        }
    }

    private void getRange(long nodeId, int startKey, int endKey, Map<Integer, String> result) {
        BTreeNode node = getNode(nodeId);
        for (int i = 0; i < node.getKeys().size(); i++) {
            int key = node.getKeys().get(i);
            if (key >= startKey && key <= endKey) {
                result.put(key, node.getValues().get(i));
            }
        }

        if (!node.isLeaf()) {
            for (Long childId : node.getChildren()) {
                getRange(childId, startKey, endKey, result);
            }
        }
    }


    private BTreeNode getNode(long nodeId) {
        BTreeNode node = bufferPool.get(nodeId);
        if (node != null) return node;
        node = diskManager.loadNode(nodeId);

        if (node == null) {
            log.warn("Node {} not found, creating empty node", nodeId);
            node = new BTreeNode(true, nodeId);
        }

        bufferPool.put(nodeId, node);
        return node;

    }

    private void saveNode(BTreeNode node) {
        diskManager.saveNode(node);
        bufferPool.put(node.getNodeId(), node);
    }


    private void save() {
        try {
            saveMetadata();
            diskManager.flush();
            bufferPool.flush();
            log.info("B-Tree saved successfully");
        } catch (Exception e) {
            log.error("Failed to save B-Tree", e);

            throw new BTreeException("Failed to save b-Tree", e);
        }

    }


    public BTreeNode getRoot() {
        return root;
    }

    public int getOrder() {
        return order;
    }

    public int getSize() {
        return size;
    }

    public int getHeight() {
        if (root == null) return 0;
        int height = 0;
        long nodeId = root.getNodeid();
        BTreeNode node = getNode(nodeId);
        while (!node.isLeaf()) {
            height++;
            nodeId = node.getChildren().get(0);
            node = getNode(nodeId);
        }
        return height + 1;
    }

    public List<Map<String, Object>> getTreeStructure() {
        List<Map<String, Object>> structure = new ArrayList<>();
        traverseTree(root.getNodeId(), structure, 0);
        return structure;
    }

    private void traverseTree(long nodeId, List<Map<String, Object>> structure, int level) {
        BTreenode node = getNode(nodeId);
        Map<String, Object> levelInfo = new HashMap<>();
        levelInfo.put("level", level);
        levelInfo.put("keys", node.getKeys());
        levelInfo.put("isLeaf", node.isLeaf());
        levelInfo.put("nodeId", node.getnodeId());
        levelInfo.put("valueCount", node.getValues().size());
        structure.add(levelInfo);
        if (!node.isLeaf()) {
            for (Long childId : node.getChildren()) {
                traverseTree(childId, structure, level + 1);
            }
        }

    }


}
