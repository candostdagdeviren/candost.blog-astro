---
title: "DDIA: How to Partition a Database"
description: "Partitioning with primary or secondary keys, rebalancing partitions & trade-offs and how to solve them and the pros and cons of each approach."
tags:
  -
date: 2022-11-13
updateDate: 2022-11-13
external: false
---

This article is part of my notes from Chapter 6 on [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

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

We talked about [data replication](/books/data-replication-in-distributed-systems) in the last chapter. Database partitioning and replication techniques are often combined. While the replication is for fault tolerance, the goal of partitioning is scaling systems. Partition means part of nodes that can be replicated to other nodes. Each node can contain multi­ple partitions, and each partition can be either a leader or a follower if replicated.

Although replication and partitioning are related, strategies and how they impact each other are not necessarily entangled. So, there is no need to discuss them together.

We'll talk about partitioning key-value data (as it is the primary index), partitioning secondary indexes, rebalancing, and rerouting.

## Partitioning of Key-Value Data

{% mark %} 💡 Partitioning aims to spread the data and load across multiple nodes evenly.  {% /mark %}

In theory, if we partition one node into fifteen nodes, the system should be able to handle fifteen times the load it handles with one node. In practice, it doesn't work like that. Depending on how we partition, some partitions take more load than others and become bottlenecks.

**Skewed System:** When the partitioning is not fair, the load is not evenly distri­buted, and one or a few nodes have more data and queries, we call the system skewed.

**Hot Spot:** The partition gets a high load in a skewed system.

Let's assume we have a simple data store with a primary key only. We can partition it in two ways.

### Key-Range Partitioning

We define boundaries for partitions with ranges in the key, similar to encyclopedias. The keys are sorted, and each is assigned to a partition. The advantage is that range queries are efficient, as we don't need to query all partitions to get a range of keys. The downside is that specific access points lead to hot spots, and the database becomes skewed. In order to manage the load, the ranges have to be adapted to the data, and the keys should be selected well. And it's often difficult to know beforehand which keys will become hot spots.

### Hash-Key partitioning

To eliminate hot spots in key-range partitioning, we can use hash func­tions for keys. Even when two keys are very similar, their hashes can be different. For this to work, we need a good hash function that gives the same results independent of where it has been run. After having hashes, we can assign each partition range of hashes. The upside of hash-key partitioning is distributing keys evenly; the downside is losing range-based query efficiency (we need to query all partitions for range queries).

We can also combine both strategies and use _a compound primary key_ where the first part is hashed to determine the partition, and the second part of the key can be ranged (for example, choosing [user_id, timestamp] as the key). Compound primary keys enable us to perform range queries on the second part.

Using the hash key doesn't solve all skew problems. In extreme cases, they still happen (e.g., having millions of followers on social media creates hot spots). There is no automatic way to handle these situations, so application developers must come up with solutions according to their use cases.

## Partitioning and Secondary Indexes

When we involve secondary indexes (as they are widely common in relational databases and the main feature of ElasticSearch), we need to find ways to use them in partitioned databases to avoid skew effectively.

> "The problem with secondary indexes is that they don't map neatly to partitions."

There are two ways to partition secondary indexes.

- **By document:** We put secondary indexes in the same partitions as the primary index. So, each partition maintains its own secondary indexes—covering only the documents in that partition. For example, if we sell guitars and secondary indexes are color and brand, searching red Fender guitars requires searching in all partitions. This method is also known as the _local index_. The disadvantage is when you want to search by secondary index, you have to query all partitions (also known as _scatter/gather_). The benefit is write operations are very fast and happen within the same partition.
- **By term:** Also known as a _global index_. In this strategy, we store indexes in partitions by their term. So all indexes of the same term are in the same partition, which covers data from all partitions. For example, searching red Fender guitars will only go to one or two partitions where the term `color:red` and `brand:Fender` are stored, as these terms will consist of a list of primary indexes of certain items. The benefit is having very fast read operations on the secondary indexes because they are often stored in the same partition as the data. But the difficulty comes with the write operations and maintaining these indexes. These secondary indexes need their own partitioning strategy, and key range or hash-value can be used to define these partitions. As secondary indexes are partitioned separately, maintaining them takes some effort too. To prevent heavy write operations from blocking the client, writing to secondary indexes are often asynchronous.

## Rebalancing Partitions

Moving load from one node to another is called _rebalancing_. The golden rule of rebalancing is data shouldn't be moved more than necessary. During rebalancing, the database should continue accepting read/write requests.

There are a few strategies to rebalance skewed databases.

### Rebalancing Strategies

- **hash mod N:** We define which data will go to which partition by using `mod` function. Don't use it at all because, with this strategy, we move data too much; every time a new node is added, most of the data is reshuffled and moved to new partitions.
- **Using a fixed number of partitions:** We assign multiple partitions to a node and use a fixed number of total partitions across all nodes. The difficulty lies in picking the right number for partitions, as it won't change later on, and data varies in time. Whenever a new node is added, it can take over partitions from each node. So, only the partitions' assignments change instead of individual data.
- **Dynamic partitioning:** When a certain partition grows, we split it into two partitions and assign the new partition to a new node. Still, each node can handle multiple par­titions, but their number is dynamic according to the data changes (we add or delete partitions). The nuisance is we don't know how many partitions we should start with; we can begin with one or multiple if we know how to split by the key (pre-splitting).
- **Partitioning proportionally to nodes:** We use a fixed number of partitions per node. When a new node is added, the new node chooses random partitions to split and takes ownership of half of the partition. Randomly choosing partitions requires using hash-based partitioning. Randomization can introduce unfair splits, but there are algorithms to prevent that.

Rebalancing can be done automatically or manually, but having a human in the loop is better. When it is automatic, it can mess up with automatic failure detection. A huge amount of data moves from one node to another; meanwhile, one node can be overloaded. During overload, the other nodes can think that this node is dead. The automatic rebalancing mechanisms try to move load from it and cause more overload on the node, the other nodes, and the network, causing a cascading failure. So keep human interaction to prevent unwanted issues.

## Request Routing

With all data rebalancing, nodes, and partitions changing, we need to take care of how the client will access the nodes. The clients should know the IP and port number to send a request. There are three ways to give this knowledge to a client.

1. Nodes can contact other nodes. When a node receives a request, and it doesn't have the data, it forwards to the appropriate node, gets data back, and forwards to the client.
2. Add a routing tier. The routing determines the node to request data.
3. Allow clients to know which node and partition to contact.

In all three options, the problem lies in learning when there is a change in the assignment of partitions to nodes. Everyone must agree on which partition to reach for specific data. We can use an external service (e.g., Zookeeper) that receives information about node changes and informs either the routing tier or clients about them.
