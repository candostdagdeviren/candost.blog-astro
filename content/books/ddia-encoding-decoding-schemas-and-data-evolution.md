---
title: "DDIA: Encoding, Decoding, Schemas, and Data Evolution in Databases"
description: "The underlying approach to encoding and decoding decides how we approach data evolution and how we use schemas."
tags:
  -
date: 2022-10-07
updateDate: 2022-10-07
external: false
featured: true
---

This article is part of my notes from Chapter 4 on [Designing Data-Intensive Applications by Martin Kleppmann](https://dataintensive.net/). You can read other chapter notes as well.

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

[The previous chapter](/books/data-storage-and-retrieval/) talked about data storage and different ways to store data. This chapter talks about schemas, encoding, and decoding.

When we look at relational databases, they have one schema defined at any point in time. Non-relational databases, on the other hand, have no schema defined; the data model can be different for each document for the same data in the application.

In both data storage models, the data never stays the same. The requirements and systems evolve, and data schema changes. When these changes happen, two concerns pop up: backward and forward compatibility.

**Backward compatibility:** new code can read the old data schema
**Forward compatibility:** the old code can read the new data schema.

Some applications might need to support both at any time because they might use rolling upgrades or the clients have optional upgrades. These strategies force systems to be compatible both forward and backward.

## Encoding Data

There are at least two data representations:

1. In memory data: Objects, structs, arrays, lists, etc. Optimized for efficient access and manipulation by CPU.
2. Self-contained bytes to transfer in-memory data to a file or over a network. As in-memory data uses pointers and they are useless while saving or sending data, we use encoding to convert data to bytes. Translation from in-memory to a byte sequence is called _encoding_ (serialization), and the other way around is called _decoding_ (deserialization).

Do not use language-specific (e.g., `java.io.Serializable`) formats to encode the data because they are inefficient, bad with versioning, tie you into a particular language, and create security problems like remote arbitrary code execution.

### JSON, XML, and Their Binary Variants

The most common encoding formats are JSON and XML. Both are common and widely loved and hated. Each has its own pros and cons.

Encoding numbers is problematic in all encoding formats. JSON supports it but not for big numbers. It also does not have precision in floating-point numbers.

JSON and XML don't support sending binary data. People use base64 encoding and pass data as a string, which increases the data size by 33%.

Schema support is optional for both XML and JSON.

```json
{
  "id": "unique-id",
  "key": "value",
  "foo": "bar",
  "number": 123
}
```

In binary variants of JSON and XML, we can get rid of empty spaces to reduce size. But the data still include field names because these binary variants don't prescribe a schema and use field names to match data with keys.

> As long as people agree on the encoding format, it doesn't matter that much which one they choose. The difficulty is agreeing on anything in organizations.

### Thrift and Protocol Buffers

Both Thrift and Protocol Buffers **require** schemas for encoding data. The encoded data doesn't include field names compared to JSON and XML. The exact encoding differs in Thrift and ProtoBuf.

Both use field tags and encode data using data types and lengths. Each encoding protocol differs in ways of encoding (using variable-length vs. fixed length for data, different bytes vs. merging field type and tag number into a single byte, etc.). The schemas include `required` or `optional` marks for data fields, but they are not encoded, only used as a routine check.

The same example in Thrift:

```
struct Request {
  1: required string id
  2: optional string key
  3: optional string foo
  4: optional i32 number
}
```

In ProtoBuf (similar to Thrift but indexes are at the end):

```protobuf
message Request {
  required string id = 1;
  optional string key = 2;
  optional int32 foo = 3;
  optional int32 number = 3;
}
```

Both have code-generation tools that generate classes for many programming languages from a schema definition.

#### Schema Evolution and Field Tags

Schemas eventually change. Using field tags correctly enables us to support forward and backward compatibility. For example, when removing a field, we cannot use the same field tag again to support forward compatibility. The same way goes for `required` fields. All new fields that come _after the initial deployment_ must support backward compatibility. When we set ourselves some ground rules, we can easily support compatibility in both directions.

Thrift with introducing and removing new fields (same example):

```
struct Request {
  1: required string id
  2: optional string key
  // 3: optional string foo (removed because of a change in requirements)
  4: optional i32 number
  5: optional i32 new_number
}
```

### Avro

Avro separates writer's and reader's schemas to offer flexibility, forward and backward compatibility, documentation, and code generation.

In the encoded data, Avro doesn't keep any field tags or names; thus, it reduces the size of the message. Avro uses the order of the data to match encoded data to decode schema (reader's schema).

While decoding, if the schemas are different, it compares the reader's and writer's schemas to match fields by looking at field names and types. When it cannot match, it uses default values. Reader's and writer's schemas don't have to match exactly; they have to be _compatible_.

After the data is decoded, the reader has access—and uses—the writer's schema. There are various ways we can provide the writer's schema to the reader. We can

- Store all schemas by version in the database and return them at the beginning.
- Include the schema version in the initial request header.
- Include the version number at the beginning of each record so that the reader first looks up the schema by the version and decodes the rest of the data after.
- Set the scheme version at the beginning of a connection and use that schema for the lifetime of the connection.

### The Merits of Schemas

The schema-based encoding made the adaption of Thrift, ProtoBuf, and Avro faster. These days, there are a lot of tooling and features around them.

Binary encoding-based schemas are more compact than JSON and XML.

Overall, schemas provide up-to-date documentation. They allow us to check backward and forward compatibility _before_ deploying any change and to generate client codes to type check in compile time.

## Modes Of Dataflow

We talked about the process of dataflow—encoding, decoding—and how to offer mechanisms for dataflow. Now, it's time to talk about how we move data from one place to another and where we use encoding and decoding.

### Dataflow Through Databases

Both backward and forward compatibility is required for databases. Because we often access the data we wrote by using the previous schema. We often read newer data with old code (e.g., during a rolling upgrade).

Migrating data is one strategy, but it is expensive, and we want to avoid it as much as possible. "Data outlives code" means we write data that might not be rewritten for years while writing new data every second. Also, we might take snapshots of data for backup and encode it with that latest schema, even though the database might include data written with different schemas.

### Dataflow Through Services: REST and RPC

Using HTTP as an underlying protocol makes a service web service—even though it's not limited to the web. There are two approaches to web services: REST and SOAP.

**REST (Representational State Transfer):** It's **not** a protocol but a design philosophy. REST uses HTTP features, URLs, and simple data formats. There is no consensus on API versioning in RESTful APIs.

**SOAP (Simple Object Access Protocol):** XML-based protocol for making network API requests. It aims to be independent of HTTP. A SOAP web service uses _Web Services Description Language (WSDL)_ to define the API. WDSL enables code generation.

SOAP users heavily rely on tooling, code generation, and IDEs, as the WDSL is not human-readable.

**The Remote Procedure Call (RPC)** model makes a network request look like a local function call. This approach is fundamentally flawed for various reasons:

- Network requests are unpredictable (request or response may be lost),
- Network request has a state that function call doesn't, which is returning without data (timeout),
- We never know if a network request went through or not, so we need to build idempotency to handle network request failure cases,
- Network request's time varies when compared to local call, which always executes at the same time wherever it is called,
- You need encoding and decoding in network requests and responses.

The new generations of RPC frameworks are more explicit about these facts.

The common usage of RPC is for internal communication processes within an organization. REST is predominant for public APIs (also good for experimentation and debugging).

RPC servers and clients need to be deployed independently (update servers first, clients second; backward compatibility on requests, forward compatibility on responses).

Using RPC across organizational boundaries makes service compatibility harder. Compatibility must be maintained for a long time because the services often don't have any control over their clients and cannot force an upgrade.

### Message-Passing Dataflow

In message-passing dataflow, the message is delivered in low latency and is not sent via a direct network connection but goes over a message broker that stores the messages temporarily. Asynchronous message-passing systems are somewhere between RPC and databases.

Message broker has certain advantages:

- It improves system reliability because it acts as a buffer in downtime.
- It automatically redelivers messages to crashed processes.
- The sender doesn't need to know the service IP.
- One message can be sent to multiple recipients.
- Decouples the sender from the recipient.

The sender doesn't wait for the message to be delivered; the communication is one way.

#### Message Brokers

One process sends a message to a queue or topic, and the broker ensures the delivery of that message to one or more consumers. There can be any number of message producers and consumers on the same topic.

Message brokers don't enforce a data schema. Keeping encoding and decoding forward and backward compatible gives the flexibility to change publishers and consumers easily.
