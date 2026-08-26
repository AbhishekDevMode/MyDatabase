package com.database.mydatabase.core.btree;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class BTreeConfig {
    public static final int DEFAULT_ORDER = 4;

    @Value("${btree.database.order:4}")
    private int order;

    @Value("${btree.database.buffer-pool-size:100}")
    private int bufferPoolSize;

    @Value("${btree.database.directory:./data}")
    private String dataDirectory;

    @Value("${btree.database.enable-cache:true}")
    private boolean enableCache;

    public static final int MAX_KEYS = 2 * DEFAULT_ORDER - 1;
    public static final int MIN_KEYS = DEFAULT_ORDER - 1;

    public int getOrder() { return order; }
    public int getBufferPoolSize() { return bufferPoolSize; }
    public String getDataDirectory() { return dataDirectory; }
    public boolean isEnableCache() { return enableCache; }

    public int getMaxKeys() { return 2 * order - 1; }
    public int getMinKeys() { return order - 1; }
}