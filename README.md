# B-Tree Database in Java

A disk-based B-Tree database implementation with full CRUD operations, query processing, and persistence.

## Features

- **B-Tree Index** - Efficient O(log n) search, insert, and delete
- **Disk Persistence** - Data survives application restarts
- **CRUD Operations** - Create, Read, Update, Delete records
- **Range Queries** - Search for records within key ranges
- **Basic Query Language** - Simple SQL-like queries
- **Buffer Pool** - Caching for improved performance
- **Transaction Support** - Atomic operations (experimental)

## Technology Stack
- Java 11+
- Maven for build management
- JUnit for testing
- Object serialization for persistence

## Getting Started

### Prerequisites
- Java 26 or higher
- Maven 3.6+

### Installation

```bash
git clone <repository-url>
cd btree-database
mvn clean install

```
Database db = new Database("./data");

// Insert records
db.insert(1, "Alice");
db.insert(2, "Bob");

// Search
Record record = db.search(1);

// Update
db.update(1, "Alice Updated");

// Delete
db.delete(2);

// Range search
List<Record> results = db.rangeSearch(1, 10);

// Close
db.close();

Project Structure
├── src/main/java/com/btree/
│   ├── core/          # B-Tree and Database core
│   ├── storage/       # Disk I/O and caching
│   ├── query/         # Query processing
│   └── transaction/   # Transaction management
├── data/              # Database files
└── test/              # Unit tests

