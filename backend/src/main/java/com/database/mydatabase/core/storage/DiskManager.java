package com.database.mydatabase.core.storage;


import com.database.mydatabase.core.btree.BTreeConfig;
import com.database.mydatabase.core.btree.BTreeNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Manages disk persistence for the B-Tree
 */
@Slf4j
@Component
public class DiskManager {

    @Autowired
    private BTreeConfig config;

    private String dataDirectory;
    private AtomicLong nextPageId;
    private RandomAccessFile dataFile;
    private RandomAccessFile metadataFile;

    @PostConstruct
    public void initialize() throws IOException {
        this.dataDirectory = config.getDataDirectory();
        this.nextPageId = new AtomicLong(0);

        File dir = new File(dataDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        File dataFileObj = new File(dataDirectory + "/btree.dat");
        File metadataFileObj = new File(dataDirectory + "/metadata.dat");

        this.dataFile = new RandomAccessFile(dataFileObj, "rw");
        this.metadataFile = new RandomAccessFile(metadataFileObj, "rw");

        if (dataFileObj.exists() && dataFileObj.length() > 0) {
            loadNextPageId();
        }

        log.info("DiskManager initialized. Directory: {}, NextPageId: {}",
                dataDirectory, nextPageId.get());
    }

    @PreDestroy
    public void shutdown() throws IOException {
        if (dataFile != null) {
            dataFile.close();
        }
        if (metadataFile != null) {
            metadataFile.close();
        }
        log.info("DiskManager shutdown complete");
    }

    private void loadNextPageId() throws IOException {
        metadataFile.seek(0);
        if (metadataFile.length() > 0) {
            nextPageId.set(metadataFile.readLong());
        }
    }

    private void saveNextPageId() throws IOException {
        metadataFile.seek(0);
        metadataFile.writeLong(nextPageId.get());
    }

    public long allocatePageId() throws IOException {
        long pageId = nextPageId.getAndIncrement();
        saveNextPageId();
        return pageId;
    }

    public void saveNode(BTreeNode node) {
        try {
            long pageId = node.getNodeId();
            long offset = pageId * 1024L; // 1KB per page

            dataFile.seek(offset);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(node);
            oos.flush();

            byte[] data = baos.toByteArray();
            dataFile.writeInt(data.length);
            dataFile.write(data);

            log.debug("Saved node {} (size: {} bytes)", pageId, data.length);

        } catch (IOException e) {
            log.error("Failed to save node: {}", node.getNodeId(), e);
            throw new DatabaseException("Failed to save node: " + node.getNodeId(), e);
        }
    }

    public BTreeNode loadNode(long pageId) {
        try {
            long offset = pageId * 1024L;
            dataFile.seek(offset);

            if (dataFile.getFilePointer() >= dataFile.length()) {
                return null;
            }

            int length = dataFile.readInt();
            byte[] data = new byte[length];
            dataFile.readFully(data);

            ByteArrayInputStream bais = new ByteArrayInputStream(data);
            ObjectInputStream ois = new ObjectInputStream(bais);
            BTreeNode node = (BTreeNode) ois.readObject();

            log.debug("Loaded node {} (size: {} bytes)", pageId, length);
            return node;

        } catch (IOException | ClassNotFoundException e) {
            log.error("Failed to load node: {}", pageId, e);
            return null;
        }
    }

    public void saveMetadata(BTreeMetadata metadata) throws IOException {
        File metaFile = new File(dataDirectory + "/metadata.ser");
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream(metaFile))) {
            oos.writeObject(metadata);
        }
        log.debug("Saved metadata: size={}, root={}", metadata.getSize(),
                metadata.getRoot().getNodeId());
    }

    public BTreeMetadata loadMetadata() throws IOException {
        File metaFile = new File(dataDirectory + "/metadata.ser");
        if (!metaFile.exists()) {
            return null;
        }

        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream(metaFile))) {
            return (BTreeMetadata) ois.readObject();
        } catch (ClassNotFoundException e) {
            log.error("Failed to load metadata", e);
            throw new IOException("Failed to load metadata", e);
        }
    }

    public boolean metadataExists() {
        return new File(dataDirectory + "/metadata.ser").exists();
    }

    public void flush() throws IOException {
        dataFile.getFD().sync();
        log.debug("Data flushed to disk");
    }
}