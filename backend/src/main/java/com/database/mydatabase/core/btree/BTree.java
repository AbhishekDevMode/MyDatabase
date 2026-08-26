package com.database.mydatabase.core.btree;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

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

}
