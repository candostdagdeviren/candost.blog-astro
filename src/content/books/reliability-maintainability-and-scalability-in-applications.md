---
title: "DDIA: Reliability, Scalability, and Maintainability in Distributed Applications"
description: "Understanding how they work is fundamental to developing data-intensive applications. This knowledge impacts our design choices, and the basics of these features demand an understanding of reliability, scalability, and maintainability."
date: 2022-08-26
updateDate: 2022-08-26
external: false
---

This article is part of my notes from Chapter 1 of [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

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

Most systems these days are data-intensive and require features such as databases, caches, search indexes, stream processing, batch processing, etc. As much as we don't get to—and don't want to—develop these features from scratch (it's rare to develop a new database engine from scratch), we use them to build systems. Understanding how they work is fundamental to developing data-intensive applications. This knowledge impacts our design choices, and the basics of these features demand an understanding of reliability, scalability, and maintainability.

## Reliability

Reliability means the application should continue to work correctly in a way that is expected _even when things go wrong_.

Reliable application functions as expected and can tolerate mistakes user makes or mistakes that happen when users use the software unexpectedly. It can prevent unauthorized access and abuse. Its performance is good enough under the expected load and data volume.

**Fault ≠ failure**; a fault is a functional or component problem. Failure is a whole system stopping providing the required service to the user. We design fault-tolerant systems to prevent failure.

Systems became unreliable because of

- Hardware Faults
- Software Faults
- Human Errors

In software systems, we can't cover every fault or error; we only take precautious steps. We tolerate certain faults. Finding out which faults we should tolerate is the main challenge of developing a reliable system.

### What are the costs of failures?

Due to the errors above, systems quickly become unreliable. The cost may vary from system to system. If we’re talking about nuclear systems, the fault might cause a failure that impacts many lives. If we’re talking about business applications, it might cause millions of dollars and eventually shut down the business.

_Our goal is to reduce these costs_. If we can decouple places where people make the most mistakes from the areas where they can cause an error, we can reduce the cost of failure. For example, sandboxing environments are a way to reduce costs. In iPhones, Apple uses application sandboxes for each application. When any application fails or crashes, it doesn't crash the whole phone. Apple increases the system's reliability by putting every application developed by third-party developers into sandboxes.

## Scalability

_Defining the system load and performance is important to understand scalability. Scalability is the system's ability (performance) to cope with increased load._ The load doesn't say anything when it's used alone. The load can be anything, depending on the system's architecture. For Twitter, as an example, it can be the number of tweets posted in a second or the number of tweets read in a second.

### What is System Load?

To talk about increasing load and scalability, we first need to define the system's _current_ load. There is no one way of doing it as it depends on the project and its architecture, but we use _load parameters_. These parameters will be different for every application.

When we think about Twitter, the load parameter is not how many tweets are posted per second alone because it's not a high number that requires scaling the whole system. If there are 12000 tweets (write operation) per second, it's easy to handle. The load parameter for Twitter is the _[fan-out](https://en.wikipedia.org/wiki/Fan-out_(software))_ effect of posting tweets. Each Twitter user follows many people, and each user is followed by many. How to build this system with 12000+ incoming tweets every second is the scalability problem of Twitter.

### What is System Performance?

Besides load, we have to understand the performance of the system before trying to scale the application. We use performance metrics. These metrics vary in different systems. In batch processing systems, it is _throughput_ (the # of records the system can process per second); in online systems, it's the _response time_ (the time between request and response, not latency).

When we take the response time, measuring it is simple: put a timer between the time the request is made and the response is received. Yet, talking about response time demands something else. We cannot only look at one single response time. Because each time we make a request, the response might arrive at different times for various reasons: network delay, database crash, garbage collection pause, package lost in the network, waiting for another system's response, etc. That's why we cannot take one request-response pair and define the performance. We need to gather a lot of pairs in a certain timeframe and analyze the response time from there by using _percentiles_.

💡When we talk about average performance, we usually talk about the _arithmetic mean_. The average is rarely useful because it doesn't say anything about how many users are experiencing delays. That's why we use percentiles.

Understanding percentiles is crucial because they are the required elements of _[Service Level Agreements (SLAs)](https://www.atlassian.com/incident-management/kpis/sla-vs-slo-vs-sli)_[—the contracts that define the expected performance and availability of a service—and](https://www.atlassian.com/incident-management/kpis/sla-vs-slo-vs-sli) _[Service Level Objectives (SLOs)](https://www.atlassian.com/incident-management/kpis/sla-vs-slo-vs-sli)_ [and](https://www.atlassian.com/incident-management/kpis/sla-vs-slo-vs-sli) _[Service Level Indicators (SLIs)](https://www.atlassian.com/incident-management/kpis/sla-vs-slo-vs-sli)_.

To calculate average performance (the arithmetic mean), we get all our response times in a certain period. Let's say we have 100 requests in a second. We order response times from fastest to slowest. When we draw a line in the 50th response time in the ordered list, that is our median response time. If the 50th item is 100ms, it means 50% of our response times are faster than 100ms, and 50% of them are slower than 100ms. The arithmetic mean is called the 50th percentile—_p50. Be careful: percentiles are not percentages._ Percentile represents a single entry in the ordered list.

Let's take the 99th item in our previous list as another example. If it is 200ms, then we can say that the 99th percentile (often referred to as p99) will be 200ms. That means 99% of the response times will be faster than 200ms. Amazon uses the 99.9th percentile (_p999_) in its internal systems. That means 1 out of 1000 response times will be above a certain threshold that they defined.

Now that we understand how we can describe performance and load, we can define SLAs in our systems and track them properly. But still, how can we approach handling the increasing load and prevent breaking our SLAs?

### Approaches for Coping with Load

There are two methods of scaling (a dichotomy): scaling up (vertical scaling) and sealing out (horizontal scaling). Although neither is a silver bullet, implemen­ting either one or a combination of two is often the right action. Choosing which way to go depends on the application and operation overall.

Some services are elastic; they can add or remove resources depending on the need. Some of them need manual scaling, which leads to a simpler system and fewer operational surprises.

What kind of scaling to use will always depend on the system. The system that scales well will be built around assumptions of defined load parameters (predicted common and rare operations).

{% mark %}💫 In start-ups and non-proven products, it's more important to iterate on the product instead of building the system for a hypothetical future load. {% /mark %}

## Maintainability

There are mainly three design principles for maintaining software systems: Operability, Simplicity, and Evolvability.

### Operability

> "Good operations can often work around the limitations of bad for incomplete software, but good software cannot run reliably with bad operations."

Good operability means making routine tasks easy, allowing the operations team to focus their efforts on high-value activities.

### Simplicity

Systems that are not made simple quickly become "a big ball of mud." To simplify systems, we need to reduce the accidental complexity, not the systems' functionality. One of the best ways to reduce accidental complexity is an abstraction. However, finding good abstractions is not easy.

### Evolvability

Making changes easy is crucial because system requirements, business priorities, technical infrastructure, and user requests never stay the same. Making a system evolvable depends on its simplicity and abstractions. Simple and easy-to-understand systems are easier to modify than complex ones. That's the idea behind _agility_. Agile working patterns such as test-driven development are helpful, but agility is often used on a local scale (a few source code files in an application); therefore, we use evolvability on the data system level.
