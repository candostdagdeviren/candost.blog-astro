---
title: "DDIA: Understanding How Database Transactions Work"
description: "Database transactions are a way to simplify the programming model, and they offer certain safety guarantees for specific errors and fault scenarios."
tags:
  -
date: 2022-12-25
updateDate: 2022-12-25
external: false
---

This article is part of my notes from Chapter 7 of [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

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

Developing reliable systems is difficult as many things can go wrong. Transactions are one of the ways to simplify a certain set of issues. In the simplest form, we can define a transaction as a group of certain (read and/or write) operations together and think of this group as (conceptually) a single operation. A transaction is a mechanism that can succeed (commit) or fail (abort, rollback) as a whole; there is no halfway success or failure.

Transactions are a way to simplify the programming model, and they offer certain safety guarantees for specific errors and fault scenarios. Of course, they are not the solution to everything and have tradeoffs. In this chapter, we will learn these tradeoffs, how to avoid them, and different isolation levels for race conditions that can help increase fault tolerance.

### ACID (Atomicity, Consistency, Isolation, Durability)

- **Atomicity:** An atomic transaction can succeed as a whole or rolls back to the beginning like it never executed anything, undoing changes it had made halfway. If an error occurs in the middle of an atomic transaction, the transaction rolls back to what it had done until that point, so the application can safely retry the same transaction without any side effect.
- **Consistency:** It doesn't belong to the ACID; it belongs to the application side. It means having consistent data (such as credits and debits must be balanced), but this ACID consistency is the application's responsibility, not the database's. An application can use isolation and atomicity features to keep data consistent, but a database cannot provide features to do the application's role.
- **Isolation:** Isolation means transactions cannot step on each other's toes. The database ensures transactions are raining in isolation and have the entire database to them like they are running serially. The database can run transactions in parallel, but the result would be like if they run in series. In reality, full isolation is rarely used due to performance penalties. We'll talk about weaker isolation levels later in the chapter.
- **Durability:** The database promises that the data will be kept after a transaction commits, even if there is hardware or any other fault. Usually, transactions are not committed until all durability mechanisms are completed. Durability usually includes write-ahead-log or similar mechanisms.

### Single-Object and Multi-Object Operations

**Single-Object Writes:** Isolation and atomicity can be provided easily. Isolation is provided by using locks on the object, and atomicity is provided by using a log for crash recovery. There are also single-object operations like the INCREMENT function in a database that eliminates read-increase-write, but these are not transactions; they are *marketed* as ACID or lightweight transactions. Transactions are mostly understood as mechanisms for multi-object multiple operations grouped as one execution unit.

**The need for multi-object transactions:** As much as we can try, there are scenarios where we need to work with multi-object updating foreign keys in multiple tables, updating data in multiple documents because the data is denormalized, and updating secondary indexes. These things can still be implemented without transactions, but error handling becomes tricky without atomicity and isolation.

**Handling errors and aborts:** Transactions provide a key feature that is a fundamental piece in error handling: abort the transaction and retry mechanism. There won't be a half-finished transaction. As good as it sounds, there are times this doesn't work, Such as leaderless replication systems. They work with the "best effort" model. The system tries as much as it can but doesn't undo anything if one part fails. It's on the application developer to handle.

Also, there are scenarios where error handling is not perfect:

- If a transaction succeeds, but the network fails, the user may think the transaction failed.
- We may get an error due to overload. Retrying the transaction will only make it worse.
- Retry is useless if the error is permanent. Try all you want; it's not going to change a thing.
- When a transaction has side effects, these side effects can still happen when the transaction aborts.

## Weak Isolation Levels

Concurrency bugs are difficult to find and reproduce. Databases tried implementing transaction isolation to hide these concurrency issues, but it had a cost on performance. The serializability, as if executing transactions one after another like they are not concurrent, is very costly, and databases are not willing to pay the price. That's why it's common to use weaker isolation levels instead. Of course, these isolation levels also come with costs and tradeoffs: they are harder to implement and can lead to subtle problems. That's why we need to understand them well and learn their tradeoffs to not rely on them incautiously.

### Read Committed Isolation Level

Offers two guarantees: no dirty reads, no dirty writes.

**No dirty reads:** A transaction cannot see any other transaction's written data until that other transaction commits. It is useful to prevent any confusion users might have caused by a transaction updating some values but has yet to finish updating others. Another confusion might arise from aborting a transaction mid-way: the user might see any data (written in the first part of the transaction) that will eventually not be there.

**No-dirty-writes:** A dirty write happens when a transaction writes a value and another transaction overwrites this value while the first transaction is not yet committed, so the first value is lost. Read committed isolation levels prevent these situations usually by delaying the second write operation until the first transaction is committed or aborted.

**Implementing read committed:** Databases implement "no dirty writes" by using locks. When a transaction writes a value, it first acquires a lock on the row and holds it until it is committed or aborted. All other transactions that need to write to the same row must wait for a lock to be released.
No-dirty-reads is implemented a bit differently. Instead of locks, databases keep both the old value and the updated value of the row. Until the writing transaction commits (or aborts), the database gives the old value to every read operation. Once the transaction commits, the database switches to the new value.

### Snapshot Isolation and Repeatable Read

![Read Skew (no snapshot isolation)](/images/content/books/designing-data-intensive-applications/No-Snapshot-Isolation.jpg)

Transaction X reads data from A and B, and transaction Y writes data to A and B (A=2, B=2). After X reads A (A=1), Y updates A (A=2) and B (B=2); now, when X reads B, it will see a new value (B=2). But what it had read from A was an old value (A=1). If X rereads A and B, it will probably see updated values.

This temporary problem is called *read skew*. To prevent read skews, we can use snapshot isolation: a transaction can only see data that has been *committed* before the transaction started. The database takes a snapshot of the data version right when the transaction begins and uses that snapshot throughout the transaction instead of using up-to-date data all the time.

#### Implementing Snapshot Isolation

While read-committed isolation maintains locks to prevent race conditions, snapshot isolation uses only *write locks*: locks resources only when writing. The golden rule of snapshot isolation is that *readers never block writers; writers never block readers*. When a transaction reads data, the database takes a snapshot at the beginning and uses that snapshot throughout the entire transaction.

As each read transaction uses snapshots, the database has to maintain all of them. For that, it uses Multi-Version Concurrency Control (MVCC). When a transaction starts, it creates a new snapshot version.

If a row needs to be deleted, the database marks these rows with a *deleted-by* label and only deletes them (via garbage collection) when it can be sure that no other transaction uses the deleted row.

Any reading transaction can see edits (write/delete) from other transactions only if they are committed before the reading transaction has started.

Snapshot isolation is also known as "repeatable read," but this term is used differently across various databases, so there is no standard.

### Preventing Lost Updates

![Both operations succeed in incrementing A, but we lose one of them due to the read-modify-write cycle](/images/content/books/designing-data-intensive-applications/Lost-Updates.jpg)

We may lose an update when two concurrent transactions try to update the same data. The lost update usually occurs when a transaction updates data right before another transaction's update. Think about incrementing a value. If one transaction takes a long time and we use a read-modify-write operation to increment a value, two increment operations update concurrently, and we lose one increment. There are certain strategies to prevent lost updates from happening:

- **Atomic write operations:** Databases can provide certain operations atomically (such as increasing a counter) instead of using a read-modify-write cycle. These atomic operations usually happen with the database taking an exclusive lock on the object.
- **Explicit locking:** Transactions can take an explicit lock on the object to prevent any other transactions (including reads) from accessing the object. All other transactions must wait for the read-modify-write cycle of the first transaction to end.
- **Automatically detecting lost updates:** The first two options force transactions to run sequentially. Another way is allowing them to run in parallel. When the transaction manager detects a lost update, it can force the transaction to retry its read-modify-write cycle.
- **Compare-and-set:** In databases that don't provide transactions, we can see this method. When data needs to be modified, the database allows it only if the data is not changed since the operation last read the data. If changed, it restarts the read-modify-write cycle.
- **Conflict resolution and replication:** Lost updates take another form in replicated databases. Especially in multi-leader and leaderless databases, it's difficult because they distribute data asynchronously. The main strategy used in these systems is to allow conflicts to happen and use application code or special data structures to resolve them. Atomic operations work well if they are commutative (regardless of order, they give the same result).

[Last-Write-Wins (LWW)](/books/data-replication-in-distributed-systems/) ([LWW](/books/data-replication-in-distributed-systems/#detecting-concurrent-writes)) method doesn't prevent lost updates, yet, it is the default in many databases.

### Write Skews and Phantom

Write skews are similar to lost updates, but there is a subtle difference. While the Lost Updates happen during writing on the same object, write skews happen on different objects causing unwanted states and are more difficult to detect. When two transactions concurrently read some data and update other data according to what they read, write skews occur.

A good example is a doctor on-call system. Think about a hospital on-call system where one on-call doctor is required at any time. When there are two doctors on-call, and both want to go off-call simultaneously, what happens? If the software is built without write skews in mind, each doctor checks if another doctor is on-call and updates its data to go off-call.

![Two doctors want to go off-call simultaneously](/images/content/books/designing-data-intensive-applications/Write-Skews.jpg)

Snapshot isolation and unsafe design make write skews possible. If we run these transactions sequentially, the second doctor won't be able to go off-call.

If a write operation in a transaction changes the result of a search query in another transaction (going off-call impacts the search of the query of how many doctors are currently on-call), it is called a *phantom*.

To solve phantoms, we can put a lock on rows that the search query returns, so another transaction won't be able to read these rows. But it doesn't solve situations when the transaction checks for the absence of rows (if there is no doctor on-call) and takes action accordingly. We can't put a lock on non-existing rows.

We can use an approach called *materializing conflicts*: creating rows for all possible scenarios in that a phantom occurs. One example is calendar events for meeting rooms. We can create 5-minute empty meeting slots for each room by default and lock them whenever someone searches them. However, this approach is error-prone, hard to figure out, and impacts the application data model. So, it should be the last resort.

## Serializability

Serializable isolation level guarantees that the transactions result like they run one after another, serially, even though they run parallel. This way database prevents all race conditions.

### Actual Serial Execution

Executing transactions one by one (serially) is not new, but it was abandoned for a while. It came back because RAMs became cheap enough and had more capacity that allowed putting all the data a transaction needs, so disk I/O operations (slow operation) are eliminated. The second reason for the comeback is that OLTP transactions are short, don't require a huge piece of data to be loaded to RAM (compared to OLAP), and are often a few reads and writes.

**Stored Procedures:** When we think about applications nowadays, they require multiple multistep transactions and run some logical operations in between. When there is a constant back and forth between a database and an application, the system spends a lot of time in network connections. Think about the doctor's on-call scenario we talked about before: if the application needs to have an if clause in between two operations (if the number of on-call doctors is greater than one, get an on-call doctor and set on-call to false for that doctor), we can move this if clause and two operations into a stored procedure. The system can run the procedure in one go without going back and forth between the application and the database. This way, systems with a single thread can execute much faster without blocking other transactions. That's why single-threaded serial transaction processing systems don't allow multi-statement transactions. Statements must be submitted in a stored procedure.

Of course, this approach has pros and cons, like everything else. The cons of a stored procedure are:

- Each database vendor has their own language
- The languages are often archaic. Compared to modern languages, they lack many basic language features. But some database vendors use modern programming languages these days.
- The libraries and tools around them are limited, and monitoring is not really possible. So, the developer experience is not good. It's also hard to test and debug.
- A database is much more performance sensitive than an application. One badly written stored procedure can slow down the whole system (because it is single-threaded).

With in-memory data and stored procedures, the throughput is quite fast on single-threaded transactions. Some vendors use stored procedures for replication: instead of replicating data, they run procedures in each replica (with one condition: it has to be deterministic—produce the same results regardless of where they run).

**[Partitioning](/books/database-partitioning/)**: With a single thread, we can actually do more. If we can partition the data well, we can assign a separate CPU to each partition and run transactions on partitions in parallel. So, each partition works with single-threaded transactions, but the whole database runs transactions in parallel. Meanwhile, there will be transactions that need to run in multiple partitions. These operations require locks on data. Databases provide support for this operation, but often, databases limit the number of transactions that can run in parallel over multiple partitions. Ultimately, it will depend on the data structure and [partitioning strategy](/books/database-partitioning/). If we pick the right structure and partitioning, we can eliminate most of these costly operations.

### Two-Phase Locking (2PL)

2PL is a more strict isolation level than no-dirty-writes. It uses locks but with a difference. The writer-locks block all other transactions. Contrary to writers not blocking readers in no dirty writes, 2PL blocks readers too.

The 2PL mechanism has two locks: shared mode and exclusive mode. There can be only one exclusive lock on the object. Any write operation must acquire an exclusive lock on the object first. If there is any other lock on the object (shared or exclusive), the write operation must wait for other locking transactions to complete. Once the write operation acquires an exclusive lock on an object, this time, all other transactions must wait. If any transaction already has a shared lock,  it can upgrade its lock to exclusive. Upgrading has the same mechanism as acquiring a new lock.

As many locks are in place, deadlocks happen (transaction A waits for B to complete while B is waiting for A to complete). Databases automatically detect deadlocks and abort one of the transactions. The application must retry the aborted transaction.

The name two-phase lock comes from any transaction acquiring the lock (first phase) and releasing the lock (second phase).

The downside of 2PL is getting hurt in the performance because of locks. That's one of the reasons for 2PL has not been widely used since the 70s. Acquiring and releasing locks also significantly worsen transaction throughput and query response times. Moreover, database latency is not predictable. Who locks when and for how long depends on the data and access patterns; one transaction may block all others.

How do we handle Phantom skews (one transaction causing another transaction's search conditions to change) in 2PL? There is a concept called **predicate lock**. Instead of acquiring a blocking lock on the object, we acquire a predicate lock on all the possible results that can return from the search query. If any data that will be written later fits into that search query, it also gets the lock. If there is any exclusive lock on the data, the transaction must wait before acquiring a predicate lock. Predicate lock prevents any other transaction from writing to that data. The key idea is that predicate lock applies to objects that the database doesn't yet have.

Most databases use index-range locks instead of predicate locks. The mechanism is similar, with a subtle difference. Instead of locking all search results, the transaction expands the predicate and puts a lock on a range of indexes that approximate the predicate. For example, if the predicate looks for meeting rooms between 13:00-14:00, the index-range locks can be put on all rooms between 13:00-14:00. If the predicate looks for a meeting in a specific room, the index-range can put a lock on the meeting room for a few days. The index-range lock is a greater set of predicate locks since we're putting a shared lock in a range of indexes. If a shared lock is already on data, the predicate locks have to wait for the shared lock to release.

### Serializable Snapshot Isolation (SSI)

2PL is more of a pessimistic locking mechanism: it uses locks in places where conflicts or race conditions may happen. It operates with the assumption that if something can go wrong, it will go wrong, so it's better to prevent it by using locks.

Serializable Snapshot Isolation (SSI) chooses the other way and uses an optimistic approach. It assumes that everything will be all right. Until something goes wrong, there is no need to take precautions. When it's obvious that something is wrong, then it is time to act. So, how do we implement that?

Similar to snapshot isolation, SSI uses snapshot isolation for reading transactions. However, when a transaction writes data according to the result of a read operation and commits, the system checks other committed transactions since the transaction started to see if anything has changed for that object(s). If it did, the system aborts the transaction because it's not safe to commit anymore.

Overall there are two cases to consider while detecting stale data:

- **Uncommitted write occurred before read (stale MVCC object version):** Serializable Snapshot Isolation works with MVCC (Multi-version Concurrency Control) to track snapshots. We ignored uncommitted writes in previous isolation levels while executing a read transaction. Now, if a write operation is committed *before* a read transaction commits, the read transaction that uses the same data will be aborted. The database keeps track of ignored transactions when taking a snapshot. If any other transaction accesses or uses data used by one of the ignored transactions, it aborts all other transactions when the ignored transaction is committed.
- **Data is modified after it has been read:** The system temporarily keeps the information about who read the data until any transaction and all concurrent ones are complete. With this information, a transaction informs other concurrent transactions that the data they had read is not accurate anymore. If one of the concurrent transactions commits, all the others must abort to prevent losing data. As there are a lot of aborts and retries, this implementation has a performance drawback. Aborts and retries happen more if the transactions are long. Therefore, SSI requires transactions to be short. On the other hand, as SSI doesn't block transactions, it's better performant than 2PL. Also, SSI is not dependent on a single CPU, like serial execution. It can leverage multi-CPUs and multi-machines. One overhead, though, is keeping track of extra information about transactions' read and write. This info can be granular or in detail. The database implementations decide its granularity. More granular is faster but error-prone; more detailed is slower but more precise, resulting in fewer transactions being aborted.
