---
title: "DDIA: Data Storage and Retrieval"
description: "At the fundamental of any database, it stores data when we give it and retrieves data when we ask for it. These fundamentals require different data structures."
tags:
  - distributed-systems
date: 2022-09-23
updateDate: 2022-09-23
external: false
---

This article is part of my notes from Chapter 3 on [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

- [Chapter 1: Reliability, Scalability, and Maintainability in Distributed Applications](/books/reliability-maintainability-and-scalability-in-applications/)
- [Chapter 2: Data Models and Query Languages](/books/data-models-and-query-languages/)
- [Chapter 3: Data Storage and Retrieval](/books/data-storage-and-retrieval/)
- [Chapter 4: Encoding, Decoding, Schemas, and Data Evolution](/books/ddia-encoding-decoding-schemas-and-data-evolution/)
- [Chapter 5: Data Replication](/books/data-replication-in-distributed-systems/)
- [Chapter 6: Database Partitioning](/books/database-partitioning/)
- [Chapter 7: Transactions](/books/understanding-how-database-transactions-work/)
- [Chapter 8: The Trouble with Distributed Systems](/books/the-trouble-with-distributed-systems/)
- [Chapter 9: Consistency and Consensus](/books/consistency-and-consensus-in-distributed-systems/)
- Chapter 10: Batch Processing
- Chapter 11: Stream Processing
- Chapter 12: The Future of Data Systems

---

If we think about the fundamental of any database, we can think that it *stores data* when we give it, and *retrieves data* when we ask for it. Sure, we're probably not going to build a database engine, but we should know roughly how they fundamentally work so we can make an informed decision while choosing a database engine for our application.

To understand these fundamentals, we start looking at data structures that power our databases, such as hash indexes, LSM trees, SSTables, and B-Trees.

## Data Structures That Power Our Database

Let's think of the simplest database that stores key-value pairs. We can have one function for retrieving an entry by searching the key and one function for saving the pair into a file. When there are a few key-value pairs, everything sounds good because when we search, we can go one by one and look for the key. Also, writing a new pair to the end of the file is not a problem at all.

However, the problem starts when our number of key-value pairs increases. Imagine going through all the keys in millions of key-value pairs one by one while searching for a key. That definitely is costly when we want to retrieve data, while it doesn't cost that much when we want to save it (if we keep writing data at the end of the file).

To solve this problem, we need a different data structure: *index.* **While storing data, we keep some metadata on the side (*index*) that acts as a signpost that helps to find data.** Adding and removing indexes don't affect the content of the database; it affects the query performance. Maintaining additional structure, of course, has an overhead.

Keeping indexes has a drawback on write performance because every write requires an additional operation to update the index. That's why databases don't index everything by default and require us to choose indexes manually.

There are multiple ways of indexing.

### Hash Indexes

The most common kind of data we can index is key-value data. In the simplest indexing strategy, we can keep a hash map where every key is mapped to a byte offset. When we seek a key in the hash map, it gives the byte offset that tells the location of the data in the disk. Then, we can go to data in one disk I/O.

![Hash indexing and update log on disk](/images/content/books/designing-data-intensive-applications/Hash-Index.jpeg)

As we keep the hash map in the memory (RAM), we don't seek disk I/O for searching the data; finding the data will be fast. We only have one disk seek for any data we need. When we add new data, we add its location to the hash map.

But so far, whenever we add new data, we append its byte offset in the log file. As the hash map is on memory, our space is limited.

How do we avoid running out of space? One solution is to break the log into segments and close segments when it reaches a certain size and make writes to a new segment file. We can then perform *compaction* on these files.

![Compaction on update log on disk segment to reduce the size of the data.](/images/content/books/designing-data-intensive-applications/Compaction-on-disk-segment.jpeg)

We can also *merge segment files* during compaction. These operations can be done in a background thread, and we can still serve read requests from old segments until we're done. Meanwhile, write requests can go to a new segment file. As we have multiple segments, reading will start from the most recent segment file and go back until we find the key. As much as this looks simple, in reality, there are various challenges: file format, deleting records, crash recovery, partially written records, and concurrency control.

Having an *append-only log* turns out to be good compared to updating files in place for a few reasons:

- Sequential write operations (append and segment) are faster than random writes.
- Concurrency and data recovery after crashes are simpler if segment files are append-only and immutable.
- Merging old segment files prevents fragmented data files.

Yet, there are limitations: **hash table must fit into memory**. If we have a very large number of keys, it doesn't work. Keeping a hash table on disk instead of memory doesn't solve the problem either because of the performance drawback of random access I/O on disk. The other limitation is inefficient range queries; we can't query keys in certain ranges.

That's where SSTables and LSM Trees jump in.

### SSTables and LSM-Trees

In the hash index table, we recorded key-value pairs. Whenever there was new data, we appended it to the end of the file. Now, we make a small change and make the keys in the file always sorted instead of appending to the end. We call this format a *Sorted String Table* (SSTable), which has several advantages over hash index logs:

1. Merging segments is simpler—even with multiple key appearances—since the keys are sorted.
2. No need to keep an index of all keys in memory to find a key. If we know some of the offsets of other keys that are closer to the key we're searching for, we can narrow down our search to that range. We can then go to that range and scan our key there. We still need an in-memory index of certain keys, but it can be sparse. It's quicker to scan only a short offset range.
3. In SSTables, read requests scan over several key-value pairs in the requested range. Since we already do this, we can group these key-value pairs and compress them before writing to the disk.

**How do we construct and maintain SSTables?**

Maintaining a sorted order key value in memory is easier than on disk. We know some tree structures work well (AVL, red-black) where inser­tion is in any order, and reading is sorted.

- In new writes, write to the in-memory balanced tree (memtable).
- If the memtable is bigger than a threshold, write it to the disk as SSTable. SSTable becomes the most recent segment. During SSTable write, a new memtable is used for write operations.
- While reading, start from memtable, then to recent disk segments.
- Frequently run a merging and compaction process to maintain order.

This scheme suffers from one problem: **if the database crashes, values in the memtable are lost**. We can prevent it by keeping a separate log on the disk that we immediately append every new write (we can discard this log when the memtable is written out to SSTable). Storage engines that are based on this algorithm are often called as **Log-Structured Merge (LSM)** storage engines, and the indexing structure is called LSM-Tree. To increase the performance, storage engines use [bloom filters](https://www.youtube.com/watch?v=V3pzxngeLqw) to identify if a key exists or not. Engines also use *size-tiered* or *leveled compaction* to determine the timing and order of how SSTables are compacted and merged.

The LSM-tree idea (keeping a cascade of SSTables that are merged in the background) is powerful. Even when the dataset is bigger than available memory, it works well, supports range queries, and has high write-throughput.

### B-Trees

The most widely used indexing structure is not log-structured indexes; it's the B-Tree.

B-Trees keep key values sorted by key. B-Tree breaks down data into fixed-size pages instead of variable-size segments.

Each page has a reference to be identified, and parent pages can refer to children with these references. The number of references to child pages in one page of the B-tree is called *the branching factor*. **The B-tree always stays balanced**. Elements of parent pages are ranges and references to child pages. This makes range queries easy to execute as well. Between two ranges in a parent, there is a reference to the child page that indicates keys between these ranges are inside the child.

![B-Trees with a branching factor 4.](/images/content/books/designing-data-intensive-applications/B-Trees.jpeg)

Updating any value for an existing key is also easy. Search for the leaf page containing the key, and change the value. When we want to add a new key, find the page whose range encompasses the new key and add it there. If the new key causes overflow, split the page into two from the middle and update the parent to reflect new ranges. This algorithm keeps the tree always balanced. As a result, a B-tree with *n* number of keys always has a depth of *O(logn)*.

When adding a new key, the overflow requires pages to be rewritten. The database can crash mid-way through this operation. A child page might become an orphan, or splitting pages might not be finished. How can we recover from there? To make B-Trees reliable, it's common to keep a *write-ahead-log* (WAL) as an append-only file. Before doing any operation on the tree, it has to be written to WAL.

Latches (lightweight locks) are also used to coordinate concurrent threads accessing and editing the tree so that threads don't see the tree in an inconsistent state.

#### Comparing B-Trees and LSM-Trees

| Advantages of LSM-Trees                                                                               | Disadvantages of LSM-Trees                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A B-tree index writes data twice. Once to WAL and second to the tree.                                 | Compaction can interfere with _read_ & \_write_s.                                                                                                           |
| Log structured indexes write the data several times due to compaction and merge (write amplification) | The bigger the DB, the more disk bandwidth is required for compaction.                                                                                      |
| On average, LSM trees are better in write throughput than B-trees.                                    | Need explicit monitoring of compaction and incoming writes. Sometimes compaction cannot keep up, and the database slows down.                               |
| LSM trees can be compressed better.                                                                   | Log-structured storage engine has multiple copies of keys in different segments. In many databases, transaction isolation is done with locks on range keys. |

There are other indexing structures that commonly use secondary indexes. These indexing structures store values within the index, use multi-column indexes, full-text search, and fuzzy indexes, and keep everything in memory.

## Online Analytic Process (OLAP)

What we have talked about earlier doesn't work well for analytic and business intelligence queries which process larger amounts of data, and often they have been executed either one-off or once a day. While Online Transaction Processing systems (OLTP) reads a small number of records in each query, OLAP systems read in bulk and aggregate data. OLAP mainly uses bulk import or event streaming to write, while OLTP has low-latency writes in random access order.

The data itself is also very different; in OLTP, the data presents the current point in time, while in OLAP, the data is historical (events that happened at a certain point in time).

These differences demanded different approaches to data storage and data retrieval. OLAP systems use column-based storage instead of row-based (SQL-like) or document-based (NoSQL-like), or graph-based storage. Therefore their *read* patterns are also different.

In OLTP systems, the disk-seek time is often the bottleneck because the number of queries is high (even though the data they require is small). In OLAP systems, disk bandwidth is often the bottleneck because even though there are fewer queries that process data, they often are demanding, requiring a big chunk of data to be scanned quickly.

In OLTP, there are two schools of thought: log-structured school (only append to file and delete obsolete files) and update-in-place school (treats the disk as a fixed-size, e.g., B-trees). These indexing strategies don't work for OLAP systems. In OLAP systems, it's important to encode data in a compact way and minimize the amount of data that the query needs to read from the disk.
