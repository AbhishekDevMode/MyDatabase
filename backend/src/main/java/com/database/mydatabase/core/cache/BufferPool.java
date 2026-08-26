package com.database.mydatabase.core.cache;




import com.database.mydatabase.core.btree.BTreeConfig;
import com.database.mydatabase.core.btree.BTreeNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * LRU Cache for B-Tree nodes
 */
@Slf4j
@Component
public class BufferPool {

    @Autowired
    private BTreeConfig config;

    private final Map<Long, BTreeNode> cache;
    private final int capacity;
    private int hits;
    private int misses;

    public BufferPool() {
        this.capacity = BTreeConfig.DEFAULT_ORDER * 25; // Default: 100
        this.cache = new LinkedHashMap<Long, BTreeNode>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Long, BTreeNode> eldest) {
                boolean shouldRemove = size() > BufferPool.this.capacity;
                if (shouldRemove) {
                    log.debug("Evicting node {} from cache", eldest.getKey());
                }
                return shouldRemove;
            }
        };
        this.hits = 0;
        this.misses = 0;
    }

    public BufferPool(int capacity) {
        this.capacity = capacity;
        this.cache = new LinkedHashMap<Long, BTreeNode>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Long, BTreeNode> eldest) {
                return size() > BufferPool.this.capacity;
            }
        };
        this.hits = 0;
        this.misses = 0;
    }

    public BTreeNode get(long pageId) {
        BTreeNode node = cache.get(pageId);
        if (node != null) {
            hits++;
            log.trace("Cache hit for node {}", pageId);
        } else {
            misses++;
            log.trace("Cache miss for node {}", pageId);
        }
        return node;
    }

    public void put(long pageId, BTreeNode node) {
        cache.put(pageId, node);
        log.trace("Added node {} to cache (size: {})", pageId, cache.size());
    }

    public void remove(long pageId) {
        cache.remove(pageId);
        log.trace("Removed node {} from cache", pageId);
    }

    public void clear() {
        cache.clear();
        log.debug("Cache cleared");
    }

    public void flush() {
        // In a real implementation, we might write dirty pages here
        log.debug("Flushing cache (size: {})", cache.size());
    }

    public int getSize() {
        return cache.size();
    }

    public double getHitRate() {
        int total = hits + misses;
        return total == 0 ? 0.0 : (double) hits / total;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("size", cache.size());
        stats.put("capacity", capacity);
        stats.put("hits", hits);
        stats.put("misses", misses);
        stats.put("hitRate", String.format("%.2f%%", getHitRate() * 100));
        return stats;
    }
}
