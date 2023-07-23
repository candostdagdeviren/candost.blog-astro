---
title: "DDIA: Consistency and Consensus in Distributed Systems"
description: Linearizability and its trade-offs, ordering guarantees, sequence number ordering, consensus, and coordination services in distributed systems.
tags:
  - distributed-systems
  - what-consistency-means
  - why-consensus-is-important-in-distributed-systems
date: 2023-05-23
updateDate: 2023-05-23
external: false
---

This article is part of my notes from Chapter 0 of [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

- [Chapter 1: Reliability, Scalability, and Maintainability in Distributed Applications](https://candost.substack.com/p/reliability-maintainability-and-scalability-in-applications)
- [Chapter 2: Data Models and Query Languages](https://candost.substack.com/p/data-models-and-query-languages)
- [Chapter 3: Data Storage and Retrieval](https://candost.substack.com/p/data-storage-and-retrieval)
- [Chapter 4: Encoding, Decoding, Schemas, and Data Evolution](https://candost.substack.com/p/encoding-decoding-schemas-and-data-evolution)
- [Chapter 5: Data Replication](https://candost.substack.com/p/data-replication-in-distributed-systems)
- [Chapter 6: Database Partitioning](https://candost.substack.com/p/database-partitioning)
- [Chapter 7: Transactions](https://candost.substack.com/p/understanding-how-database-transactions-work)
- [Chapter 8: The Trouble with Distributed Systems](https://candost.substack.com/p/the-trouble-with-distributed-systems)
- [Chapter 9: Consistency and Consensus](https://mediations.candost.blog/p/consistency-and-consensus-in-distributed-systems)
- Chapter 10: Batch Processing
- Chapter 11: Stream Processing
- Chapter 12: The Future of Data Systems

---

What we discussed so far has built our understanding of consistency and consensus. In this chapter, we learn how to build fault-tolerant systems. We'll assume all troubles and problems we mentioned in the last chapter can occur, try to find ways to prevent them, and sometimes let the system fail. That's why we need to understand what is possible and what's not. We will learn our limits to provide consistency and learn how to build consensus (it's sometimes better if everyone agrees that things are wrong).

So far, we heard about different consistency levels, such as eventual consistency. In this chapter, we'll learn stronger consistency models and their trade-offs.

## Linearizability

The idea behind the linearizability is to make the system appear as if there is only one replica without any replication lag, even though there are multiple replicas behind the scenes. There are subtle details or nuances that impact how linearizability works, but the main idea is that once one client has seen a new value, all other clients should also see that new value and never the old one. Hence, wherever two clients concurrently request data from different replicas, they should see the same data.

Situations such as selecting a leader in a single-leader system demand linearizability. When [discussing](69-The%20Trouble%20with%20Distributed%20Systems.md#The Truth Is Defined By The Majority) single-leader systems, we mentioned that leaders acquire a leader's lock. There shouldn't be any two nodes acquiring the leader's lock simultaneously. All replicas should accept the node which acquires the lock first as their leader.

Other use cases include choosing a unique username in a user system, selecting seats in a theatre, or booking a seat on a plane. Although these situ­ations are based on one channel (e.g., one service), there can be cross-channel timing dependencies that require linearizability, such as saving an image and using a message queue to resize it to get a thumbnail in parallel (full-size image must be stored before requesting it to resize) to show in the user creation process.

One confusion is quorums. Quorums in [leaderless replication](Data%20Replication%20in%20Distributed%20Systems.md#Leaderless-Replication) seem linearizable, but they are not. If we use a quorum of two (within three nodes), one client can write a new value to node-1, and another client can read from the other two nodes (node-2 and node-3, satisfying quorum of two) concurrently while the writer is processing writes in node-2 and node-3. When a client reads, they see the old value. Quorum is satisfied, but linearizability is not.

Multi-leader systems are by nature non-linearizable (they concurrently process write operations).

### The Trade-Off of Linearizability

If we want linearizability, we have to understand its cost. When we think about keeping data in multi-data centers, we must consider network delays between the data centers. If everything runs smoothly, we can offer linearizability (with synchronous cost). If we use a multi-leader approach, linearizability can be provided from each data center, even if the connection between them is interrupted. Each data center can synch data asynchronously once the connection is restored.

If we use a single leader, we have more problems because the leader can be in the other data center (not in the one the client sends the request). We must return an error because linearizable read and write operations will require the leader. If clients can get data directly from followers, we won't provide linearizability.

The CAP theorem is often mentioned with linearizability with its *availability* property. But picking two out of three doesn't work; the real solution is "either consistent or available when partitioned." A system can either provide availability or consistency (linearizability), not both. But also partitioning is different in the CAP theorem. It refers to network faults, which is something we cannot avoid at all.

Additionally, not many systems provide linearizability, not because of availability but because of performance. Even when network delays are insignificant and have a reliable network, it is still costly in performance to provide linearizability.

## Ordering Guarantees

We have seen [the ordering](Data%20Replication%20in%20Distributed%20Systems.md) and [learned](Data%20Storage%20and%20Retrieval.md) [about concurrency](Data%20Replication%20in%20Distributed%20Systems.md) in many places across the book. The information about which operation happened before another helped us to offer [different levels of guarantees](Understanding%20How%20Database%20Transactions%20Work.md). This happened-before is a *comparison operation*. When we want to put everything in total order, we should be able to *compare* certain things somehow. Yet, not everything is comparable.

For example, two mathematical sets are incomparable: how can we compare {a, b} and {b, a}? We can only say they are partially ordered and can think about causally ordering them. So what's different between total order and causality?

*The total order is linearizability*. One thing happens after another. **There are no concurrent operations.** *Causality is having causally related operations*; we can order them but can't compare them whether they are concurrent or not.

That shows that there are different ordering guarantees. In linearizability, there is no concurrency (it's a stricter consistency than causal consistency). Also, linearizability implies causality: if everything is in total order, it's causally correct.

So, how can we implement these ordering guarantees?

### Sequence Number Ordering

It's difficult to track ordering operations and identify causality. If we track every operation and determine which ones are causally dependent on another, we would create a large performance overhead. Instead, we can use sequence numbers and timestamps to bring *total order* to the operations in the system.

If each operation is assigned a unique number, we can use these numbers to order operations. For example, if the system has a single leader, this leader can assign each operation a sequence number or timestamp and use these numbers to order operations. In multi-leader or leaderless systems, *each node* can assign a number together with a unique node id to make these operations uniquely identifiable. However, we still have the problem of ordering (or causally relating two operations) across nodes if the system doesn't have a single leader.

Before we solve the problem across nodes, let's look at non-causal sequence number generators. Imagine we have two nodes: one can generate and assign odd numbers, and the other even numbers. This way, we can get unique numbers for each operation, but one node can be used more, and the other node's number can stay behind. Thus, it still doesn't tell us which operation came first. Another method is using timestamps generated by a time-of-day clock. However, it's subject to clock skew, as [we learned before](The%20Trouble%20with%20Distributed%20Systems.md). Another method is using preallocated numbers in each node (e.g., node A uses 1-1000, node B uses 1001-2000). But again, same as even-odd numbering, using preallocated numbers doesn't ensure a causal relationship.

To solve all these issues, we have Lamport timestamps. Lamport timestamps are presented as (counter, node-id). As the pair will always be unique, Lamport represents the total order. If the counters are equal, the higher node-id will be greater. As this structure is the same with even/odd numbering, the system uses an extra parameter to satisfy causality requirements. Every node and every client keeps track of the maximum counter it has seen so far and includes the maximum on every request sent.

Although using Lamport timestamps brings total order and makes a system consistent with causality, it doesn't solve the problems such as choosing a unique username. Even if we can decide who came first, we can only tell after the order is *finalized*. If the order is not finalized yet, we cannot tell if a client making a username request can/should succeed. And for that, we need a total order broadcast.

### Total Order Broadcast

Total order broadcast is, as the name tells itself, ensuring operations are executed in order across partitions and nodes. Using total order broadcast makes a system act like it has a single partition with a single-core CPU. Systems provide this guarantee with two qualities: **reliable delivery** (*no matter what happens, every node gets the message*) and **total order delivery** (*no matter what happens, every node gets the messages in the same order*).

In total order broadcast, the message order is fixed at the time messages are *delivered*; no node can intervene and retroactively insert a message in between if the subsequent messages have already been delivered. We can think of delivering messages like creating logs (transaction logs, write-ahead logs, etc.): we append any incoming messages to the end. As all nodes have to deliver the same messages in the same order, the nodes can get the logs and process the same message sequence.

Linearizability and total-order broadcast are related but not the same. Total order broadcast guarantees that messages will be delivered in order but **doesn't guarantee when they will be delivered**. In contrast, linearizability is a recency guarantee: a read operation is guaranteed to see the latest written value. We can implement linearizable storage using total order broadcast and total order broadcast using linearizable storage. Actually, both solutions are equivalent to a consensus that we were building upon. If we solve one of these problems, we can build another solution using similar (or sometimes the same) techniques.

## Distributed Transactions and Consensus

Until now, we learned about transactions, replication, system models, linearizability, and total order broadcast. These were useful to know before tackling the consensus problem, which seems simple on the surface but more complicated when diving deep. Consensus is important in especially a few cases, such as leader election and atomic commit. If there is no consensus in the leader election (meaning, two leaders accept writes in a single-leader configured system), the data becomes inconsistent.

### Atomic Commit and Two-Phase Commit (2PC)

Two-phase commit (2PC) separates from single-node transactions by providing atomicity by implementing two phases: prepare and commit. A transaction manager (or coordinator) manages this process to ensure all nodes are either committed or aborted. The 2PC process starts with all nodes reading or writing data as normal. When nodes are ready to commit, the coordinator sends a "prepare" message and asks nodes if they can commit. If all nodes answer "yes," then the coordinator sends another message (the second phase) and tells them to commit. If any node says "No" to the prepare request, the coordinator aborts the process and sends an abort message to all nodes.

**How does the system work in detail?**
After reads and writes (like in a single-node transaction), the coordinator asks if all nodes can commit. When a participant says "Yes," it has to wait. The node waives all abort rights by saying, "Yes." This is a critical point of no return. Until the node receives the commit message, it has to wait in an uncertain or in doubt state. Once all nodes say yes, the coordinator decides to commit/abort by appending a log message to the transaction log on disk. Right after the log is on disk, it sends a commit/abort message to all nodes. If the commit/abort message fails, the coordinator must retry it forever. If a participant fails at any time, it will commit when it recovers. That log on disk is another critical decision point; there is no turning back. So, in reality, 2PC is actually an atomic transaction *in the coordinator*.
**What happens if the coordinator fails?**
If the coordinator fails before sending the "prepare" message, all nodes can safely abort the transaction. But once the participants receive the "prepare" message and vote "yes," they cannot abort unilaterally until they hear back from the coordinator. If the coordinator fails at this point, the participants have to wait for the coordinator to recover. This is why the coordinator must write the decision to its transaction log before sending a commit/abort message. Once the coordinator recovers, it checks its transaction log. If there are any transac­tions without commit messages, it aborts all.

### Distributed Transactions In Practice

Distributed transactions have a mixed reputation due to their impact on performance and causing operational problems. Much of the performance problems come from disk syncing that's required for crash recovery and extra network round trips. On the other hand, they provide safety features that are hard to reach otherwise. Although performance is usually what we optimize for, we still have things to learn from distributed transactions.

There are two types of distributed transactions.

1) Database-internal
2) Heterogeneous.

In database-internal distributed transactions, databases implement accor­ding to their needs and use protocols as they wish. Distributed tran­sactions are used for data replication and partitioning, and databases use the same software or protocol across the whole database. Database-internal transactions work well as they don't need to be compatible with other systems. We face most challenges in heterogeneous distributed transactions.

In heterogeneous distributed transactions, systems use different soft­ware and, sometimes, systems are also not databases, such as message brokers. Here, distributed transactions must ensure commits are atomic within this variety.

The most important piece in heterogeneous distributed transactions is atomicity. Let's say we have a message broker that sends a message to a service. The message can only be acknowledged if and only if the database transaction, which is processing the message, was successfully committed. The system must ensure these two operations (acknowledgment and database write) are successful by using atomic commit. If any of them fails, the transaction is aborted, and the message broker can send the message again. If there is no atomic commit, every retry can cause side effects. For example, if we're using an email delivery service, every retry can send an additional email. Distributed transactions ensure the side effects of a message happen if and only if both operations (ack and database write) are successful.

#### XA Transactions

X/Open XA (eXtended Architecture) is not a protocol but simply a C API for interfacing with a transaction coordinator. Participants of a distributed transaction offer XA API.

The application that needs distributed transactions uses an XA transaction coordinator living in the same process or machine as the application. The coordinator can ask participants to prepare and commit/abort via a client library or network driver that the participants implement for XA with its XA API.

The major problem is if the coordinator dies (e.g., the process is killed or the machine crashed), all the participants will be stuck in a locked state waiting for the coordinator. When the coordinator recovers, it can read the logs for transaction decisions. The database holds locks at the whole row that the transaction will write, preventing dirty writes (we talked about it in read-committed). Also, if a transaction includes reading and we want serializable isolation, then the database will hold locks for read transactions as well, practically blocking all other transactions that want to access that data. These locks will stay until the coordinator recovers or is manually resolved by an admin.

When the coordinator fails and its recovery logs are corrupted or lost for any reason, the admin must look at all the partici­pants and check if anyone committed the transaction. Then the admin must decide and apply the decision to all participants. Many XA implementations have an escape hatch called heuristic decisions: a unilateral decision by the participant of a transaction to decide on commit or abort. As the participant decides, the heuristic decision breaks atomicity. Thus, these cases are intended for catastrophic situations only.

#### Limitations of distributed transactions

- If the coordinator is not replicated but runs on a single machine, it becomes a point of failure.
- Many server-side apps are stateless these days and save their states in a database. However, when the coordinator is part of the server, the server becomes stateful as it should keep coordinator logs on the state and should recover from failures by using these logs.
- XA cannot detect deadlocks across systems and is incompatible with Serializable Snapshot Isolation.

### Fault-Tolerant Consensus

Consensus means getting several nodes to agree on something. Formally, one or more nodes may propose values, and the consensus algorithm decides on one of the proposed values. Any consensus algorithm must satisfy the following properties:

- **Uniform agreement:** No two nodes decide differently.
- **Integrity:** No node decides twice.
- **Validity:** If a node decides value v, then v was proposed by some node.
- **Termination:** Every node that does not crash eventually decides on some value.

The first two values are the basics of consensus; everyone decides on the same value, and you cannot change your mind later. Integrity property rules out trivial cases, such as an algorithm cannot decide on a value not proposed by a node. The last property, termination, is there to formalize fault-tole­rance. Also, it prevents having dictatorial setups where only one node decides on everything. The termination property ensures that if any node fails (and assumes that it won't come back online), the system can continue making decisions. (that's also why 2PC is not a consensus algorithm; it requires every node to be online, including the coordinator. If the coordinator fails, the system comes to a halt.) Of course, there is a limit to failures. Any consensus algorithm requires at least the majority of nodes to be functioning (have a quorum). However, most consensus algorithms ensure that the first three properties are always met, even if most nodes are crashed. This way, the system may not process requests, but it cannot corrupt the consensus system by making invalid decisions.

The most known fault-tolerant consensus algorithms actually don't make decisions on a single value in each round, but they agree on a sequence of values, which makes them total order broadcast, as we learned earlier in the chapter.

Total order broadcast requires messages to be delivered to all nodes exactly once, in the same order. This strategy is equal to several rounds of consensus. All nodes decide to deliver the same messages in the same order (agreement). Messages are not duplicated (integrity). Messages are not corrupted or created out of thin air (validity). Messages are not lost (termination).

#### Epoch numbering and consensus

The consensus algorithms we talked about above don't guarantee that there will **always** be a single leader. However, they guarantee a single leader for each epoch (a round), a number defined by a protocol, and it's monotonic and ever-increasing.

Each time a leader is dead, a new selection starts. This election is given an epoch number, and there can be only one leader with this epoch number. If there is another leader (maybe a node remained from the last round but was thought dead), a higher epoch number wins.

Before doing anything, the leader checks if there is another leader with a higher epoch number. However, it cannot decide on that itself. Thus, it requires a quorum of nodes' votes. For every value leader proposes, the leader sends the value to a quorum of nodes. A node accepts the proposed value only if it knows no other nodes with higher epoch numbers exist.

We have two rounds of voting: one round for selecting the leader and another for voting on the leader's proposal. The key is the attending nodes on two rounds must overlap: there has to be at least one node that is present in both rounds, even though quorums can consist of different nodes. This rule ensures that there is no other leader in the process.

The algorithms we discussed look similar to Two-Phase Commit (2PC) but are different. 2PC requires all nodes to vote "yes'' while consensus demands a *quorum*. Also, 2PC is not fault-tolerant like consensus algorithms, and the 2PC coordinator is not elected.

#### Limitations of consensus

- Voting on a proposal process is very similar to synchronous replication. The committed data can be lost, as we saw earlier chapter.
- The consensus requires a strict majority of nodes to operate (as we learned quorums in [the data replication chapter](Data%20Replication%20in%20Distributed%20Systems.md) before). If we have three nodes, we can tolerate one node's failure; in five nodes, two failures. If any network failure happens, the non-majority can be blocked.
- Adding and removing nodes to the system is difficult. Consensus requires a fixed set of nodes (There is dynamic membership, but it's not well understood in the industry.).
- The consensus relies on timeouts to detect failed nodes. [Unbounded delays](The%20Trouble%20with%20Distributed%20Systems.md) can cost performance due to frequent leader elections.

### Membership and Coordination Services

Zookeeper and etcd are eventually key-value stores, databases that fit into memory (but still write to disk for durability). However, they implement consensus algorithms. What makes them useful is the features they provide, even though application developers rarely interact with them directly (they are used indirectly; e.g., Kafka and HBase use Zookeeper). They provide an interesting set of features:

- **Linearizable atomic operations:** Atomic compare-and-set operations allow implementing a lock: if several nodes try to write, only one will succeed. The consensus comes into play and guarantees that the ope­ration is atomic and linearizable even in node failures (leases are used in locks).
- **Total ordering of operations:** With [fencing tokens](The%20Trouble%20with%20Distributed%20Systems.md), Zookeeper prevents clients from conflicting with each other. Zookeeper uses total ordering and assigns each operation a monotonically increasing transaction ID and version number.
- **Failure detection:** There are periodic heartbeat checks between Zookeeper and the client. If heartbeats fail above timeout time, the client is considered dead (it's called an ephemeral node in Zookeeper).
- **Change notifications:** Clients can subscribe to changes in Zookeeper instead of requesting information regularly, so they can be notified when a new client joins the cluster.
Even though only linearizable atomic operations require a consensus algorithm, combining these features makes Zookeeper worthwhile.

Also, Zookeeper can be used to allocate work to nodes. While partitions can join and leave the cluster, they can register or be declared dead on Zookeeper. Using the combination of features listed above, we can automatically implement mechanisms to recover from failures without human intervention. However, this implementation is complex and difficult. That's why Zookeeper and etcd are often used for service discovery. This service discovery doesn't require consen­sus. However, leader election requires consensus, and knowing the leader (discovering) becomes important, and other services can discover the leader via Zookeeper. Hence, some consensus systems support read-only caching replicas. They do not participate in voting and asynchronously receive the all decision log of the consensus algorithm and serve read requests that are not needed to be linearizable.

---

This article is part of my notes from Chapter 9 of [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

- [Chapter 1: Reliability, Scalability, and Maintainability in Distributed Applications](https://candost.substack.com/p/reliability-maintainability-and-scalability-in-applications)
- [Chapter 2: Data Models and Query Languages](https://candost.substack.com/p/data-models-and-query-languages)
- [Chapter 3: Data Storage and Retrieval](https://candost.substack.com/p/data-storage-and-retrieval)
- [Chapter 4: Encoding, Decoding, Schemas, and Data Evolution](https://candost.substack.com/p/encoding-decoding-schemas-and-data-evolution)
- [Chapter 5: Data Replication](https://candost.substack.com/p/data-replication-in-distributed-systems)
- [Chapter 6: Database Partitioning](https://candost.substack.com/p/database-partitioning)
- [Chapter 7: Transactions](https://candost.substack.com/p/understanding-how-database-transactions-work)
- [Chapter 8: The Trouble with Distributed Systems](https://candost.substack.com/p/the-trouble-with-distributed-systems)
- [Chapter 9: Consistency and Consensus](https://mediations.candost.blog/p/consistency-and-consensus-in-distributed-systems)
- Chapter 10: Batch Processing
- Chapter 11: Stream Processing
- Chapter 12: The Future of Data Systems
