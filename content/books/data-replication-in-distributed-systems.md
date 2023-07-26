---
title: "DDIA: What is Replication in Distributed Systems"
description: "Replication is keeping the copies of data between multiple machines that are connected via a network."
tags:
 - distributed-systems
 - why-distributed-systems-are-difficult
date: 2022-10-06 09:53:52
updateDate: 2023-07-23 10:20:53
external: false
---

This article is part of my notes from Chapter 5 on [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

- [Chapter 1: Reliability, Scalability, and Maintainability in Distributed Applications](/books/reliability-maintainability-and-scalability-in-applications)
- [Chapter 2: Data Models and Query Languages](/books/data-models-and-query-languages)
- [Chapter 3: Data Storage and Retrieval](/books/data-storage-and-retrieval)
- [Chapter 4: Encoding, Decoding, Schemas, and Data Evolution](/books/encoding-decoding-schemas-and-data-evolution)
- [Chapter 5: Data Replication](/books/data-replication-in-distributed-systems)
- [Chapter 6: Database Partitioning](/books/database-partitioning)
- [Chapter 7: Transactions](/books/understanding-how-database-transactions-work)
- [Chapter 8: The Trouble with Distributed Systems](/books/the-trouble-with-distributed-systems)
- [Chapter 9: Consistency and Consensus](/books/consistency-and-consensus-in-distributed-systems)
- Chapter 10: Batch Processing
- Chapter 11: Stream Processing
- Chapter 12: The Future of Data Systems


---

Replication is keeping the copies of data between multiple machines that are connected via a network.

We replicate data to either serve users from the closest data center to _reduce latency_, allow the system to continue working if one part fails (to _increase availability and fault tolerance_), or scale the machines to serve more read requests to _increase read throughput_.

{% mark %}🧶 _All the difficulties in replication are related to handling changes in replicated data._{% /mark %}

In this chapter, we'll see leaders, followers, multiple-leader and leaderless systems, synchronous and asynchronous replications, problems in all these strategies, how to solve them, and the pros and cons of each system. We'll start with understanding the leader and follower, synchronous and asynchronous replication, and dive into three different strategies to replicate data using the leader-follower structure.

## Leaders and Followers

A _replica_ means a node that holds a copy of the database.

When there are multiple replicas, how do we ensure the data client writes copied to all replicas?

We assign one replica as a _leader_ and distribute data from the leader to others—_followers_. In this setup, whenever a client wants to insert, update, or delete data, it goes to the leader, and the leader's job is to pass down that operation to follower replicas. Although the client is limited to talking to the leader for the write operations, it can read data either from the leader or any follower.

How does the leader effectively send the data changes to its followers?

### Synchronous vs. Asynchronous Replication

A leader can send data changes to a follower either synchronously or asynchronously. There are pros and cons for each implementation. Database systems can also combine both approaches (a leader synchronously replicating to one follower while using asynchronous replication with others).

In fully synchronous replication, the write operation awaits the data replication to a follower to succeed. If any problem occurs during replication, the write operation returns a failure. In sync replication, the data will be _available_ and _durable_ in at least two nodes—leader and follower. If the leader fails, we can assign the synced follower as a new leader without the risk of losing data. However, if a follower slows down for any reason (like network latency), the leader will have to block all incoming write requests and can become unresponsive until the follower is back up again.

In fully asynchronous replication, there is no problem with waiting for followers in write operations and no blocking the clients. Writing to the leader returns a response without waiting for replication. But if the leader fails in the middle of a replication operation, we lose the data that's not replicated to followers. The data is _not durable_ in the advantage of _write availability_.

When we consider the pros and cons of both replication strategies, we often combine async and sync (often called _semi-synchronous_): the leader synchronously replicates to one or two nodes and uses asynchronous replication with the rest of the followers.

### Handling Node Outages

**Follower Failure:** Each follower keeps a log of data changes it applied before. When any follower fails and restarts, it can request new data changes from the leader by looking at its last logged data.

**Leader failure:** The leader's failure and assigning a new leader is called a _failover_. Failovers can be done manually or automatically. The automatic process looks like this:

1. Determine that the leader has failed.
2. Choose a new leader.
3. Reconfigure the system to use the new leader.

Albeit looking simple, the whole automatic process is fraught with possible problems:

- What happens when the new leader doesn't receive all updates from the old leader (if async replication is used)?
  - When the old leader rejoins, there may be conflicts. In that situation, we may discard the old leader's data fully, but it harms _data durability_.
- Discarding data has more problems if that data is used in other systems and coordination (side effects).
- What happens when two leaders are configured to be a leader (in certain fault scenarios, it's possible)? If both leaders accept writes and have no process of handling conflicts, it's dangerous. We may shut down one of them, but we have to be careful in designing that mechanism.
- How can we define the right timeout to declare the leader has failed?

Now we know the sync and async replication and handling node outages. How can we add a new node to increase _read throughput_ and _fault tolerance_?

### How to Set Up A New Follower

1. Take a snapshot of the leader without blocking the writes.
2. Copy the snapshot to a new follower.
3. Request data changes from the leader since the snapshot is taken.
4. Process the data changes on the new follower. Then, the follower caught up.

Once we set up a new follower, it's time for it to receive data updates from the leader. That's done via replication logs.

### Implementation of Replication Logs

Each time data is changed, the system replicates data by sending logs from leader to followers in one of the following ways:

- **Statement-based replication:** Replicating every _write statement_ (`INSERT`, `UPDATE`, `DELETE`, etc.) to followers. This method is problematic when there are nondeterministic functions in the statements (e.g., `RAND()` or `NOW()`), when statements use an auto-incrementing column (the order of statements has to be precise in this case), or statements have side effects (unless the side effects are deterministic).
- **Write-ahead log (WAL) shipping:** [We talked about WAL before with SSTables, LSM-trees, and B-Trees](/books/data-storage-and-retrieval/#b-trees). The WAL is append-only, and the leader can send logs to follower replicas; then, the follower builds the exact same data structures as the leader has. WAL shipping is used by PostgreSQL and Oracle. The disadvantage is that it couples data to the storage engine as WAL operates at the byte level. Thus, upgrading storage engines to new versions can be problematic.
- **Logical (row-based) log replication:** Similar to write-ahead logs, but to decouple storage engine logs and replication, a logical log is used. For a relational database, logical log records actions _per row_. These logs include all columns if a new row is inserted. If a row is deleted, they include enough information to identify the row. If the data is updated, logs include all (or only updated) columns of the row. The decoupling allows us to upgrade the storage engine when needed without much hassle.
- **Trigger-based replication:** Predefined database replication methods are not enough when we want to customize replication to our use case. Databases offer _write triggers_ for application developers to allow them to do something when a write occurs. App developers can register their codes that are automatically executed when any write action happens.
  Databases implement this method by logging the change to another table that can be read by an external process to replicate the data. Trigger-based replication is more error-prone and has greater overheads.

Now we know how the replication logs work, we need to understand the problems we face when there is a lag between leader and followers during the replication process and how to approach these problems.

## Problems with Replication Lag

Using synchronous replication for all followers is not a great solution, as any small problem in replication (like a network lag) can block all write operations. On the other hand, asynchronous replication also has a tradeoff: in ideal scenarios, replication takes a fraction of a second, but when there is a network lag or any other issue, the replication takes much longer and creates _replication lag_.

When a client reads data both from the leader and a lagged follower at the same time, it will see differences in data. If a client waits for a follower to catch up and reads it, it will see updated data. That's why these systems (systems with replication lag) are called _eventually consistent._ The word "eventually" is intentionally vague because it's not certain how long the lag can be.

There are ways to overcome lag problems and/or shorten them.

### Read-After-Write Consistency

If a client writes some data and immediately reads it, how can we ensure that it reads the latest version of the data? As write operations go to the leader and read goes to the follower, the replication lag may create inconsistency during these situations.

To solve the problem, the client can read from the leader right after updating the data. This strategy is known as _read-after-write consistency_ (or _read-your-writes_).

There are a few ways to implement read-after-write consistency:

- When the user wants to read something they _may_ have modified, read it from the leader. For example, in social networks, a user can always read their own profile from the leader replica because only the user updates their profile, no one else. The user can read other profiles from the followers.
- If most things in the app are editable by the user, use other criteria for the decision: for example, the last update time. If a user updated data in the last two seconds, use the leader replica while reading it.
- Another strategy is saving the last timestamp user wrote something. During the next read operation, the system can then check the timestamp and read from the leader to reflect updates at least until that timestamp. There are more complications if a user accesses the data from multiple devices, but we won't get into it now.

### Monotonic Reads

Replication lags sometimes cause moving backward in time: a user writes data and reads it from one replica with a lesser replication lag, then refreshes the screen and reads old data from a follower with a greater replication lag. The user sees new data and old data in sequence. Monotonic reads mean that the user won't see the old data after they have seen the new data. It's a lesser guarantee than strong consistency but stronger than eventual consistency. One way to implement this is to ensure the user always reads from _the same_ replica.

### Consistent Prefix Reads

Sometimes, data has causality, and the order of the write operations is crucial (like messages in a chat app); when different replicas are used in conversation, anomalies like broken message sequences can occur. Preventing these anomalies requires consistent prefix reads. This problem happens more in sharded databases. One solution is writing the causally related data to the same shard, but there are also some algorithms we can use. We'll talk about sharding (or partitioning) in the next chapter.

### Solving Replication Lag

Replication lag is complex to handle in the application. In the application code, don't pretend the replication is synchronous when it's actually asynchronous.

Transactions are there to prevent complexity in the application. Their role is to provide stronger consistencies. The book dives into it in later chapters.

## Multi-Leader Replication

In this model, we have more than one leader who accepts writes, and each leader also acts as a follower to the other leaders.

> _Avoid multi-leader replication if you can. The benefits rarely outweigh the drawbacks it has._

There are only certain situations where multi-leader configuration is reasonable:

- **Multi-datacenter operation:** If the data needs to stay geographically close to users or the system needs to reduce the risk of an entire data center failure, choosing the closest data center as a leader and replicating writes to other data centers asynchronously makes sense (while having a single leader replica in each data center). This strategy increases the _perceived performance_ and better _tolerates data center outages_ and _network problems_(e.g., interruptions don't prevent writes). The downsides are _conflicts_ and strategies to resolve them. Also, configuration pitfalls occur if there are auto-incrementing keys, triggers, etc.
- **Offline working clients:** In theory, if a client works offline, each client becomes a leader because they keep data on their local system. Conflict resolution becomes a real problem because data synchronization can happen after hours, days, or even weeks. Mobile calendar apps are good examples.
- **Collaborative Editing:** Think of apps like Miro or Google Docs. In this system, a user's change is applied to their local replica and asynchronously replicated to others. If the system doesn't maintain a lock on the database, it becomes multi-leader, and conflict resolution becomes a challenge. One strategy to keep conflicts minimum is _having the unit of change tiny_. For example, Google Docs uses a keystroke as a unit of change.

### Handling Write Conflicts

Write conflicts are one of the big problems of multi-leader configuration. There are several ways to handle them:

- **Use synchronous conflict detection:** Waiting for the data to be replicated to all replicas before telling the user the write operation is successful. This strategy causes losing the main advantage of multi-leader configuration: asynchronously and separately accepting writes in each replica.
- **Avoid conflicts:** Designing the system to avoid conflicts in the beginning. For example, using only one data center for the same user whenever they write data avoid conflicts. Still, there should be mechanisms to handle when the user moves geographically and becomes closer to another data center.
- **Converge toward a consistent state:** Here, the goal is to have the same data in each replication. To ensure that, between conflicting operations, we can choose one write operation as the final one. There are various strategies, such as giving each write operation a unique ID and choosing the last one, including assigning each replica ID and choosing the higher ID in conflicts, merging values together (e.g., concatenating), or recording conflict in a special data structure and handling it in the application later in time (e.g., via prompting the user).
- **Create custom resolution logic:** Multi-leader replication tools allow us to write application code that runs in conflicts. We can use them to build our own logic.

### Multi-Leader Replication Topologies

When there are more than two leaders, we have different replication strategies to use. _Circular_(one replica sends data to another in a circle), _star_ (one replica sends data to all replicas), or _all-to-all_ (all replicas send data to all other replicas) topologies are different ways to send data to other leaders.

The main problem of circular and star topologies is having a single point of failure.

All-to-all is the most used topology, and its challenge is causality. For example, when a client creates and immediately updates a value, these two write operations have to be received in sequence by other leaders. As the connection between leaders may vary, some leaders can fall behind and receive the update operation first. Yet, they cannot update a value that doesn't exist. [Version Vectors](https://martinfowler.com/articles/patterns-of-distributed-systems/version-vector.html#solution) technique can be used, but these conflict detection mechanisms are often poorly implemented in database systems.

## Leaderless-Replication

The replication approaches we learned all had leaders. The leaderless systems have one difference: every node can accept writes. These systems are also called Dynamo-style databases. Also, in some of these systems, there can be a coordinator that is different than a leader.

The idea is simple (each node can accept write operation), but the problems are not. That's why instead of how implementing these systems, we will spend time understanding their challenges.

### Writing to the Database When a Node Is Down

If one node is not available, what happens when we receive new writes from a client?

Clients read from multiple replicas at the same time to solve this problem. Also, version numbers are used for data so that clients can decide which data is the latest one by looking at its version number.

Another challenge is, what happens when this node comes back and has stale data?

There are two mechanisms to repair stale data.

One is **read repair**: whenever the client reads stale data from a node that is behind and up-to-date data from the other nodes, the client sends updated data to the node that was behind.

The other mechanism is the **anti-entropy process**: the system regularly checks the differences between nodes and updates stale data. The anti-entropy process doesn't care about the order of data; it just syncs nodes.

The read repair works well for values that are often read. The anti-entropy process is good for values that are rarely read. Both mechanisms improve _durability_.

**How do we count a read or write operation as successful?**

When there are _n_ nodes, we focus on getting a successful response from a certain number of them. All requests are still sent to all nodes, but we await only a few of them to return success. In general, we want to ensure we get up-to-date data from at least one node in every read and update data in most nodes in every write.

We can formalize this.

If every write must be confirmed by _w_ nodes to be considered successful, and we must query _r_ nodes to get up-to-date data in an _n_ node system, generally speaking, _w + r > n_ should give us _up-to-date reads_.

For example, if we choose _n_ as 5, we need to choose _w_ and _r_ as 3, so every time, we will wait for 3 nodes to succeed while writing or reading data. Even if writing to the remaining two nodes fails, we will have one node with up-to-date data. While reading, we'll have at least one node where we get updated data. So, one node will always overlap.

Reads and writes obey these rules are called _quorum reads_ and _quorum writes_. A common choice is selecting _n_ as an odd number and setting the _w_ and _r_ as _w=r=(n+1)/2_ (rounded up). Keep in mind that writes and reads are still sent to _n_ replicas, but we only count _r_ and _w_ for how many nodes we wait for.

### What are the limitations of Quorum Consistency?

- If Sloppy Quorum (details below) is used, there is no longer guaranteed overlap between _r_ nodes and _w_ nodes.
- When two concurrent writes happen, there are no guarantees which one will be the first (conflict resolution is required).
- If a read is concurrent with a write, there is no guarantee for the read to return after the write (or up-to-date value).
- If a write succeeds in fewer replicas than expected _w_, there is no rollback mechanism for updated nodes.
- If a node with up-to-date data fails and a replica with a stale value is used for recovery, the _w_ quorum condition can be broken.

### Sloppy Quorums and Hinted Handoff

Sometimes, due to networks or any other issues, clients cannot reach the nodes to write data and cannot satisfy _w + r > n_ to reach a quorum. A client can still reach a few nodes but not "home nodes" of data. In this case, database designers have a tradeoff: either return an error or write to available nodes that are not among _n_ nodes that need to be written to. The latter case is called a **sloppy quorum**. Once the nodes come back, any writes in these temporary nodes are sent to the "home nodes," and this operation is called **hinted handoff**.

### Detecting Concurrent Writes

There is no good database-level solution to solve conflicts that arise from concurrent writes. Application developers have to know and handle the conflicts in the application code. There are mechanisms that help them.

First, we need to understand what concurrent means, then we can define ground rules to solve conflicts.

If clients A and B write to a key simultaneously, we cannot tell which is first because there is no first—they are simultaneous. We can keep some identifiers like timestamps to define which write operation is the last one and use that one while discarding the rest. This strategy is called _Last-Write-Wins (LWW)_. But it is problematic because of the challenges of clock synchronization between nodes (more details are in later chapters), and we lose data if we discard the rest of the data that is not the last.

We actually define concurrency differently: when two nodes are not aware of each other's write operation, they are concurrent. It's not directly related to timing and clocks. While replicating data, nodes eventually catch up (eventual consistency). While catching up, there can be some write operations to nodes that are behind. We count these write operations as concurrent even though they happened later in time, just because the node is not aware of another node's data.

We can use _version numbers_ to solve conflicts. Each request to write data gets a new version number from the server, and clients send these version numbers back in each write request. So, the server can decide if the client has outdated data by looking at its version. Meanwhile, the server keeps older versions to perform merge operations. Also, applications can merge data: when it receives updated data, they can merge it with a new value they have and send it to the server together along with the version number they received from the server.

A client has to read a key before write. When a client reads a key, the server returns all values that are not overwritten with their latest version numbers. When the client merges values it received from the server and the value it owns, it sends back, and then, the server overwrites the values.

When a client wants to remove data, the system doesn't remove it but puts a delete marker that is often known as _a tombstone_. This way, no data is lost, but clients have to do some work.

This whole strategy is efficient for a single replica, but what about leaderless replicas?

We need to keep another version number for a replica as well and use it with the version number within the replica. The algorithm is the same as above, but this time each replica increments its own version number when a new _write_ comes in and keeps track of the other replicas. A collection of version numbers from all replicas is called the _[version vector](https://en.wikipedia.org/wiki/Version_vector)_.
