---
title: "DDIA: The Trouble with Distributed Systems"
description: "The most common and known problems and challenges of Distributed Systems."
date: 2023-01-20
updateDate: 2023-01-20
external: false
---

This article is part of my notes from Chapter 8 of [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

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

Welcome to the pessimistic chapter.

## Faults and Partial Failures

So far, we have mentioned some failures and discussed how to prevent them. In distributed systems, there are way more things that can go wrong.

In a single computer, the system is deterministic; whatever happens, we can try the operation again and get the same result. Moreover, a single computer system has no partial failure; if it fails, it fails. Things can still go wrong in a single machine, and the computer usually prefers to crash the system instead of returning a wrong result. There might be some faults or bugs, but they often result from badly-written software.

On the other hand, distributed systems consist of multiple computers connected via a network. They are fundamentally different.

> **Note:** We're not discussing supercomputers in this book, even though they are also distributed systems; we're interested in commodity computers connected via a network.

While building distributed systems, we must accept that partial and complete system failures will happen. We need to develop fault-tolerance mechanisms to recover from both kinds of failures or prevent them in the beginning. Therefore, fault handling must be part of distributed system design. We cannot assume everything is all right or be optimistic.

## Unreliable Networks

When we talk about distributed systems, we mean shared-nothing computers communicating via a network. Nothing is shared means we must rely on the network, which can fail at any given time for various reasons. A package might never arrive; it can be damaged on the way even if it arrives; the other device might not accept it because of a fault; the package might queue up in the machine if that machine is overloaded. Let's say the package went, but the response takes the same way back. It might get lost due to a misconfigured switch or any other reason. It might also arrive late due to a network overload on the requesting machine. In any way, it's impossible to know why there is no response to a request. One of the best strategies to handle these situations is to use timeouts: give up waiting for it. When a timeout happens, we still don't know whether the other machine got our message.

Having network problems play a significant role in practice. As the failures can happen at every level (scaling from one network switch to entire data centers), there is no way to avoid them. The only option is either handling or tolerating them. While handling requires deliberate precautions, tolerating might mean just showing the user an error message and saying, "network problems are happening." We need to test our systems consistently to find out how we handle these problems and when to display an error message.

If everything is unreliable, how do we even find out any fault?

### Detecting Faults

Many systems detect faults in one way or another. But until there is a successful response from the application, it's impossible to know what exactly failed.

In distributed systems, we can detect faults in the load balancer level to stop sending requests to a failed node or to detect a failed leader and assign a new one.

Moreover, everything can fail in the network, such as switches, routers, applications, machines, etc., and there is sometimes no way of detecting a fault; we only use timeouts to declare a node is down and take action. We can have retries, but eventually, we must announce a node is dead.

### Timeouts and Unbounded Delays

If there is no other way than using timeouts, how can we use them effectively?

If we define timeouts as too short, we may accidentally declare a node dead while there is just a temporary slowdown. If we define the timeout as too long, we increase the waiting time for a dead node out of nothing and create a bad user experience.

We can use retry mechanisms when working with short timeout values. Yet that is also problematic: if a node is just slowed down temporarily and our operation is in the queue, we mistakenly can redirect the operation to another node; as a result, we execute the operation twice. Moreover, we can cause a cascading failure if the other node is already heavily loaded when we transfer a request to another node.

That may sound pessimistic, and it is. But it's the reality.

There is no guarantee for any delay to be a certain amount. Asynchronous networks have unbounded delays. They work with a premise to deliver packets as quickly as possible but without an upper limit in delays. Their main focus is reliability on the delivery, not on time.

Also, switches in the network redirect incoming packages to different links. When a network switch sends many incoming messages to the same link, a queue builds up and creates network congestion. Hence, it increases waiting time.

If we think more deeply about the protocols, there is also a delay that comes from TCP: when a package is not acknowledged (lost in the network), TCP retransmits lost packages after a certain timeout. This timeout value is also not consistent. Systems like TCP and Cassandra use dynamic timeouts calculated based on the previous network round-trips and response times.

As a result, it's almost impossible to define certain timeout values. We have to understand the network and systems we're using and how they work, so we can better estimate timeouts and adjust them according to our systems. To do that, we must learn the difference between synchronous and asynchronous networks.

### Synchronous Versus Asynchronous Networks

When we think about phone calls, they are synchronous. They allocate a certain amount of bandwidth on the network (called a circuit) end-to-end between two callers. The system knows how many bits it needs to transfer when establishing a connection. Therefore, it can allocate bandwidth with certainty (~100 kbps per line is recommended). If we have a network capacity of 10000 connections, we can have 10000 concurrent calls without anyone waiting. We can also have one call and 9999 empty lines. Even data passes several routers from one end to another; the space is reserved when the call is established. There is no queuing, and end-to-end network latency is fixed. That's what we call _bounded delay_.

TCP connections are optimized for speed, so expectations differ. While establishing a connection, the packet sizes and bandwidth requirements are unknown (unlike in phone connections). Imagine we follow the same approach as phone calls and use a specific bandwidth size for all connections. Let's say we have 10000 connections capacity again. If one connection needs to load a gigabyte of data in that network and we have a 100kbps limit per connection in the hardware, it has to wait a long time, and the other 9999 slots will be empty and become wasted resources. We might directly allocate a 1gbps line to one data stream by using all remaining slots, but it's impossible to know how much bandwidth is needed initially. That's why queueing is used. We optimize for speed, and if a TCP connection requires massive bandwidth in the network, others queue up and wait for their allocation. All data centers and the internet is optimized for busty traffic. TCP optimizes the data transfer rate to the available network capacity.

As the network setup we use will build queues and have unbounded delays, we cannot guarantee any specific delays or reliability. That's why it's impossible to set correct timeouts. We have to experiment with it.

Experimenting and learning our challenges more in detail requires knowing how clocks work.

## Unreliable Clocks

There are two types of clocks: monotonic and time-of-day clocks. These two serve different purposes and work differently.

**Time-of-day clocks:** The time is calculated based on an epoch (usually Gregorian calendar UTC Jan 1, 1970) and without counting the leap seconds. These clocks are usually synchronized using Network Time Protocol (NTP)—with the goal of making the same timestamp meaning the same thing on different machines. While synchronizing, jumps may occur; one clock may go fast and can be 10 nanoseconds in front. The clock can jump back when it is synched. That's why these clocks are not suitable for calculating the elapsed time (e.g., timeouts).

**Monotonic clocks:** Monotonic clocks always go up. Imagine a counter counting nanoseconds. It doesn't care about which day or time of the day; it just counts. The absolute value of the clock is meaningless; its goal is to tell us how much time elapsed between two points accurately. Each computer (or CPU) has its own monotonic clock. Albeit useful for calculating elapsed time because there won't be any jumps, they are useless when it comes to comparing two monotonic clock values. Monotonic clocks are normally not synced between machines (or CPUs). NTP can still be used to adjust the speed of a monotonic clock, but jumps cannot occur; NTP either slows down or fastens up the clock a certain amount.

### Relying On Synchronized Clocks

Clocks have several pitfalls that make them unreliable. Quartz clocks have delays and skew. To solve this issue, we can also synchronize them with NTP. But NTP improves the situation rather than solving it because even synchronization makes a network round trip and is destined to delay.
Hence, using time-of-day clocks requires designing the system against the clock faults. We must constantly monitor the clock offsets between all the machines and synchronize them before the offsets get bigger.

Most problems arise when timestamps are used for decision-making in the applications. Even when the clocks are synchronized, the nature of NTP and quartz clocks make it inaccurate to use the timestamp (there will always be an offset between two clocks), and we often don't know how much the offset is between clocks. Let's say two clients update the same value in two replicas, and we replicate these values to other nodes. How do we decide which client's operation is the first if we rely on the timestamp of the initial nodes?

It is challenging to separate writes that happen in quick succession or truly concurrent. Moreover, two machines can generate exactly the same timestamp, especially when the clock has only a millisecond resolution. If we use Last Write Wins (LWW) as a conflict resolution strategy, the database can mysteriously drop values by mistake because of clock skew. We can also use additional tiebreakers or version vectors to resolve these situations.

Another problem we mentioned is not knowing the confidence of a clock. Most machines only give the current time as the exact date and time. However, when asked about the current time, Google's True Time API provides two values to increase confidence: (clock-earliest and clock-latest). When we know the confidence interval, we can be more accurate in deciding which operation happened first in conflict resolution.

Lastly, we talked about Snapshot Isolation and Repeatable Read. In Snapshot Isolation, it's crucial to identify if a read operation happened after a write operation (as we offer the snapshot). When these operations occur in one machine, it's less of a problem. But in a distributed system, it's still a problem. Using Google's API for transaction ID generation to understand rolling IDs and deciding which transaction is first doesn't solve the problem.

### Process Pauses

When we use clocks on the critical path of a system, we face another set of issues. For example, let's say we decided to keep the leader node for a specific time; after that time passes, we choose a new leader. One way to know if the leader still holds the position is by checking if the leader has enough time left in its position at the beginning of each request. Here, right at that moment, the system can pause the process for an unknown time for a variety of reasons.

These reasons include garbage collection (GC), allocating the memory for another virtual machine, a user closing down the laptop lid, an operations engineer sending a stop process signal by mistake, and many more. Weird things happen when these processes continue where they are left off. If the leader had been paused, the system could have declared another node as a leader. Suddenly having two leaders might create many problems.

In distributed systems, real-time requires having response time guarantees. Real-time capabilities (unlike real-time data streaming on the web) are often built for security-critical systems like opening airbag in a car (we don't want to be blocked by garbage collection in an accident) and demands extensive testing and robustness. That's why real-time is not economical and practical in most server-side data processing systems. Therefore, we will suffer the pauses and clock instabilities.

Yet a few things can be done to limit the garbage collector's impact. We can schedule garbage collector's work frequently. Small iterations of the GC process prevent long-running GC pauses. Another approach is considering GC pauses like an outage in a node and letting other nodes handle incoming requests while GC is working in the node. Some latency-sensitive financial trading systems use this approach.

## Knowledge, Truth, and Lies

With all these problems we mentioned, it is almost impossible to make anything right because there are tons of things that can go wrong. We often don't know what is wrong (remember, we cannot distinguish problems that happen in the network). While being lost in the unknowns, the only thing we can do is to make assumptions and build distributed systems with _some_ truths and knowledge and offer some guarantees.

### The Truth Is Defined By The Majority

When we rely on one node to decide anything, we create a single point of failure. Imagine one node deciding by itself that it is the leader in the system while other nodes think someone else is. Or imagine a scenario where one node thinks they are alive and healthy while others cannot reach it due to a network problem, and they declare that node dead.

When considering these scenarios, a system cannot rely on one node's decision about certain topics. But the system can operate with a majority or—as it is called—a quorum. Individual nodes must obey the quorum's decisions instead of taking action alone.

For example, if we build a system that requires grabbing a lock on storage to write data, we have to build mechanisms to prevent the node that has the lock from misbehaving. When a node's garbage collector stops every process to clean up while the node has a lock lease from the lock service for writing data, the lease may expire. Meanwhile, another node can acquire a lease and write data to the same file. Once the garbage collector finishes, the node continues as if nothing happened and, assuming it still has the lease, writes to the storage, and corrupts the file. This was a real bug in HBase, and there is a way to prevent it.

We can add fencing tokens to the lock service. Every time a lock is leased, a fencing token (a monotonically increasing number) can be returned with it. The node can use the token to write to the storage. If the storage receives a write request with a lower-numbered token, it rejects it. While we require the storage to take an active role in the system, we cannot let clients accidentally abuse the system. We must consider building mechanisms to prevent clients from using systems incorrectly. We cannot assume they will always behave well.

### Byzantine Faults

In this book, we ensure that nodes—at least—tell the truth within their best knowledge despite not answering, answering late, or answering with outdated values. They don't cheat the system. When one node doesn't tell the truth (e.g., sends a confirmation for a message it never received), Byzantine faults occur; the problem of reaching consensus in entrusting environment (Byzantine Generals Problem).

These problems mostly occur in aerospace systems where radiation corrupts hardware and sends unreliable messages or in systems where some nodes may try to cheat because of fraudulent activity. But overall, we most probably don't need to build Byzantine-tolerant systems because we mostly work with nodes in the same data center and a closed network. But there are certain things we can do to prevent lies in our system. For example, we can put input validation to prevent SQL injection and input character limiting to prevent denial of service due to large memory allocation.

### System Model and Reality

There are tons of problems that can happen. While we cannot take cover for every problem or play Pollyanna and ensure everything will run perfectly, we create expectations and assumptions for systems so we know how they _should_ behave. These assumptions and expectations are defined using models.

For example, we can use system models about timing, such as synchronous, partially synchronous, or asynchronous models, to build systems with specific ground rules. When we talk about faults, we can use crash-stop faults, crash-recovery, or Byzantine faults models to formalize our expectations. While these models reflect reality (or we want to create a reality with these), algorithms have other models to be defined as "working correctly"—algorithms have properties that say what it means to be correct. These are categorized as safety and liveness properties. If we think about an algorithm that generates unique fencing tokens, uniqueness is a safety property; the same applies to a monotonic sequence. And if we expect the node requesting the fencing token to receive a response _eventually_, we can say that the availability property is defined as the liveness property. In practice, we expect safety properties to always hold and liveness properties to have room for caveats.
