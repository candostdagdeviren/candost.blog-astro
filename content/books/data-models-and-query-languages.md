---
title: "DDIA: Data Models and Query Languages"
description: "The relational, document-based, and graph-based data models are the fundamentals of understanding data-intensive applications along with query languages."
tags:
  -
date: 2022-09-04
updateDate: 2022-09-04
external: false
---

This article is part of my notes from Chapter 2 on [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

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

Data modeling might be one of the most difficult processes of software engineering. On top of that, data presentations differ for application developers from hardware engineers. Within these difficulties, we must learn how data modeling approaches work to choose the best one for our problem.

## What is a Data Model?

Data modeling is creating a simplified data representation of our application's data from the real-world or other services we use and defining how this data flows through the application by using a database management system.

There are **two schools for data modeling**. Both of them have advantages and disadvantages. As it's the same for everything in software engineering, the modeling approach of choice will depend on our use case.

## Relational Data Model vs. Document Data Model

Structured Query Language (SQL) is the best-known data query language based on the relational model that was proposed in 1970 by Edgar Codd. It has been here for decades, and no other data models have overthrown its dominance. NoSQL is the latest attempt to do that and was born because of the need for scalability with very large datasets, people looking for open-source and free software instead of commercial data­bases, businesses' need for specialized query operations, and the need for more dynamic and expressive data models.

Yet, it looks like SQL is not going away and will stay together with non-relational databases.

### The Root Problem of Data Modeling: The Object-Relation Mismatch

A lot of applications are written with object-oriented programming. When these applications want to store data in a relational database, they require a translation layer because data models between the application (object or class definitions) and the database (tables defined by schemas) don't match. This mismatch is called _impedance mismatch_ ([borrowed](https://en.wikipedia.org/wiki/Impedance_matching) from electrical engineering).

When we consider a social profile as an example (LinkedIn), we can store profile data in relational databases. Although we will have one field for a person's name and/or surname, one person may have multiple jobs and educations that we have to store somehow. Earlier versions of SQL used foreign keys to connect separate tables (education table, profile table, job positions table, etc.). We may use the same approach or use newer versions that allow storing multiple entries in one row using struc­tured data types (XML, JSON) while keeping the querying option.

We can also encode the data in JSON/XML and store it in a text column and let the application handle its data structure and content. For applications like LinkedIn, JSON representation is better. It has a better locality than the multi-table schema and makes the one-to-many structure (one person → multiple jobs, education, etc.) explicit.

> _Locality: all data is in one place and accessible via a single query._

Even though JSON is good for one-to-many, there are many-to-many relationships that we have to consider.

### Many-to-One and Many-to-Many Relationships

Applications are evolving and changing day by day. **The initial data model of applications often does not fit into the future requirement.** For example, think about Facebook and city and institution names. Initially, we might save the city as a string in the profile database. But how can we update the city name in every profile it's used? City names can change due to a political change, or Facebook might give every city a page. In these cases, updating the city string to ID will be the solution.

> We can remove duplications and replace them with IDs that refer to other rows in other tables. This operation is called **normalization**.

When IDs are used, the relational databases can run _join_ operations easily to collect data across multiple databases.

On the other hand, **document databases often don't support _join_ operations**. This operation is moved to the application. The application has to emulate join operations by making multiple queries to the database.

When considering different types of relationships, relational and document-based databases have pros and cons.

### Relational Databases vs. Document Databases: Pros and Cons

![Relational Databases vs. Document Databases](/images/content/books/designing-data-intensive-applications/relational-vs-document-databases.png)

|Relational Databases|Document Databases|
|---------|--------|
| Join operations and references support many-to-one and many-to-many relationships nicely. However, if the application doesn't have these relationships a lot, it might not need a relational database. | It's not possible to refer directly to the nested items. Yet, if there is no deep nesting, document databases are usually fine. The poor support for `join`s may or may not be a problem. It depends on our application. If there are a lot of many-to-one or many-to-many relationships, the document model is not that great because these cases need to be handled by the application. |
| **Shema-on-write:** Enforcing schema on write operations is similar to static type checking (compile-time) in programming languages. Ensures data schema is the same, and nobody can put broken data into the database. When we want to change data format, we have to perform a migration. (e.g., initially having one field for name and surname and separating it later). These schema changes (migrations) might be slow depending on which database is used (MySQL, PostgreSQL, etc.). Some databases might even require downtime. |**Schema-on-read:** Seeking schema on read is similar to dynamic type checking (run-time). This operation moves schema constraint to application. When we want to change the data format, we have to support old documents in the application code and start using the new format in the new documents. |
|Advantageous when data is homogeneous because it enforces a mechanism and documents it (with explicit schemas).|If the data is heterogeneous, it's advantageous. No explicit schema makes it adaptable.|
| Storage locality is supported in some databases (e.g., Spanner, Oracle, Big table) but in different strategies to group related data together. | Provides data locality, which can be powerful or harmful. If the document is big, the performance gets worse. When we need a small section of a document, we have to read the whole document. *Rule of thumb: keep documents fairly small & avoid writes that increase the document size.*|

Overall relational databases have document features that allow storing and performing `join` operations on XML and JSON. Also, document databases (e.g., RethinkDB, MongoDB) have relational-like `join`s that are similar to relational databases. Although these `join` operations are slow—as they require a network round trip—**both relational and non-relational approaches are becoming more similar and adapting good sides from each other.** These feature intersections are good for the future of databases.

## Query Languages: Imperative vs. Declarative

![Imperative vs. declarative languages](/images/content/books/designing-data-intensive-applications/declarative-vs-imperative-languages.jpeg)

Most programming languages are _imperative:_ we define how the algorithm will work step by step. We tell the computer line by line what it should do.

On the other side, SQL is a _declarative_ language: we define what we want in the end, the criteria that the result should fit into, and how we want the data to be transformed. We don't get into defining the algorithm or steps that the database engine needs to execute in order. Our focus is on the end result.

Declarative languages—such as SQL—hide the implementation details. **When we write an SQL query, it's up to the query optimizer to decide which operations the query needs and the algorithm it will use during execution.** As we don't care how the data is retrieved from the storage, the query optimizer can decide the order of operations as well.

**This abstraction (asking for the end result) allows the database to do behind the scene imp­rovements.** If memory optimization is needed, the database can move data from one place to another without breaking any query written before. As we define the order of data we want in the query, we don't know how the data is stored. If we were using an imperative style, the database couldn't do that because we would need to write the query according to how the data is stored.

Lastly, declarative languages have the advantage of running tasks in parallel. They have a better chance for parallelization because we only define the resulting pattern, not the algorithm, to determine the results. The query optimizer can run tasks in parallel if it needs. In imperative languages, parallelization is more problematic because we define the order of operations one by one.

> "The fact that SQL is more limited in functionality gives the database much more room for automatic optimizations."

### MapReduce Querying

MapReduce is used in document-based databases. It is a lower-level programming model than SQL. MapReduce supports using Javascript in the middle of a query, which is great but writing carefully designed Javascript functions is not that easy. There are also limitations (like in MongoDB, map and reduce functions have to be [_pure functions_](https://en.wikipedia.org/wiki/Pure_function)). That's why MongoDB added an "[_aggregation pipeline_](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)" to support a declarative approach.

## Graph-Like Data Models and Graph Query Languages

Relational databases support many-to-many relations already, but when it's too much, it becomes challenging to manage, connect, and query data. **When many-to-many relationships are common in the application, graph-like data models are better solutions.**

![Graph-like data store. Vertices are connected with edges.](/images/content/books/designing-data-intensive-applications/Graph-Like-Model.png)

A graph has two object types: **vertices** (also called nodes, entities) and **edges** (also called relationships, arcs).

There are two graph models to structure and query data: _the property graph model_ and _the triple-store graph model_.

### Property Graphs

![Property Graphs](/images/content/books/designing-data-intensive-applications/Labeled-Property-Graphs.jpeg)

Each vertex has a unique ID, set of outgoing edges, set of incoming edges, and collection of properties (key-value pairs).

Each edge has a unique ID, the vertex the edge starts (tail), the vertex the edge ends (head), a **label** to describe the relationship between two vertices, and a collection of properties (key-value pairs).

**There is no schema restriction in this model.** We can have any vertex connecting to others for anything. We can also traverse the graph because we know any vertex's incoming and outgoing edges. Additionally, labels give the flexibility to define the relationship between two vertices.

This model gives us _**flexibility**_ and _**evolvability**_. When we need to extend our features in the application, we keep adding new data to the existing graph. However, the graph data store easily becomes a mess. We need to be careful with a single graph data store.

### Triple-Stores

In Triple-Stores, the data is stored in three-part statements: `(subject,predicate,object)`. This model is mainly equivalent to the property-graph model. The subject is equivalent to the vertex. The object is one of two things: a value in a primitive data type or another vertex. When it's another vertex, the predicate is on the edge of the graph, the subject is the tail, and the object is the head.

Examples: `(alice,age,23)`, `(alice,marriedTo,bob)`

### The Foundation: Datalog

The data model is similar to triple-stores but generalized a bit.

`(subject,predicate,object)` becomes `predicate(subject, object)`

We can also define rules to tell the database new predicates on top of the data's predicates. It's similar to functions. These aren't triples in the database. They are derived from data or other rules. Rules can call others or themselves recursively.

Datalog is a subset of Prolog and uses a bottom-up approach instead of a top-down approach Prolog takes.

## Summary

Choosing a database query language and data model is difficult. Data modeling processes are important in database management systems to support the application we're developing. Representing physical data models or logical data models in conceptual data models will always be difficult. Once we understand the basics, we can make an informed decision about our data architecture and database design.

Document databases are good for one-to-many data modeling. Relational databases are good for one-to-many, many-to-many, and many-to-one relationships. When many-to-many relationships are extensive in the database, graph-based models are better for storing and representing data.

Relational databases are also suitable for homogenous data, while document-based databases are better for heterogeneous data due to the lack of a fixed schema.

When it comes to languages, a declarative language is designed as an abstraction layer for the details and has a huge advantage for behind-the-scenes optimizations. On the other hand, imperative languages are better for programming languages and services. When it comes to query operations, declarative languages (such as SQL) are the way to go.
