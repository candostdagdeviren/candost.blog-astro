---
title: "Building Microservices: Integration of Microservices - Part 1"
description: "The most important aspect of technology correlated with microservices is integration. When we get it right, microservices are autonomous and independent. If we get it wrong, the risk of catastrophe increases."
tags:
  -
date: 2021-03-04
updateDate: 2021-03-04
external: false
---

This post is Chapter 4, Part 1 of my notes from the book [Building Microservices: Designing Fine-Grained Systems](https://samnewman.io/books/building_microservices/).

1. [Chapter 1: Microservices and Their Benefits](/books/microservices-and-their-benefits)
2. [Chapter 2: The Evolutionary Architect](/books/the-evolutionary-architect)
3. [Chapter 3: How to Model Microservices](/books/how-to-model-microservices)
4. [Chapter 4, Part 1: Integrating Microservices](/books/integrating-microservices-part-1)
5. [Chapter 4, Part 2: Integrating Microservices](/books/integrating-microservices-part-2)
6. [Chapter 5: Splitting the Monolith](/books/splitting-the-monolith)

---

The most important aspect of technology correlated with microservices is integration. When we get it right, microservices are autonomous and independent. If we get it wrong, the risk of catastrophe increases.

## Guidelines for the Ideal Integration Technology

- Avoid Breaking Changes
- Keep Your APIs Technology-Agnostic
- Make Your Service Simple for Consumers
- Hide Internal Implementation Detail

## The Shared Database

Database integration is the most common one when we look around the industry.

When we share the database, we allow multiple services (and possible external parties) to bind to internal implementation details. When we want to change the DB schema, we can easily break the consumers. This situation results in a lot of regression testing.

At the same time, we tie the consumers to a specific technology stack, our database of choice.

The shared database doesn't fit our guidelines. It doesn't hide internal implementation details. If we use shared databases, we need to change every consumer. In the end, it causes [tight coupling and weak cohesion](/books/how-to-model-microservices).

## Synchronous vs. Asynchronous

The request/response model aligns with both synchronous and asynchronous communication.

The event-based collaboration model is the opposite of the request/response model. Instead of sending a request and initiating action, we inform other parties of an event and expect them to know what to do. Event-based systems are asynchronous.

## Orchestration versus Choreography

In orchestration, we have one service communicating with multiple services to do one task. The service plays the orchestrator role by sending requests to others and organizing the response according to their responses. In this method, we have to take care of things like single service failure. The services become tightly coupled, and one change requires more in others.

In Choreography, one service publishes an event, and the others who subscribe to the event take action and do the job. The system is more loosely coupled and more flexible. However, this system requires extra work for monitoring and tracking the process across system boundaries.

"I strongly prefer aiming for a choreographed system, where each service is smart enough to understand its role in the whole dance."

## Remote Procedure Calls

"Remote procedure call refers to the technique of making a local call and having it execute on a remote service somewhere."

### Downsides of Some RPC Implementations

- Technology Coupling
- Local Calls Are Not Like Remote Calls
- They are not the same, and RPC hides this fact.
- The fallacy of assuming the network is always reliable makes debugging harder.
- Brittleness
- Some RPC implementations require deploying both the new version of the server and clients at the same time. Not being able to separate the client and server deployments is one of the challenges of binary stub generation.

### Is RPC Terrible?

No, not that much.

Make sure to derive the server without locking the upgrades of the client and server together. And make your network visible by not abstracting the remote calls too much. Make sure that the clients know that they will make a network call. Structure the client libraries right.

## REST

The concept of resources is crucial in microservices. In REST, the external representation of a resource is decoupled with an internal stored format.

### REST and HTTP

HTTP provides useful capabilities (such as verbs like GET and POST) and comes with a great ecosystem of tools and technology aligned with the REST style.

HTTP can be used with RPC, too. But RPC doesn't use a lot of things HTTP provides.

### Hypermedia As The Engine of Application State (HATEOAS)

Content contains links to other resources, and the client should communicate with the server via these links. It's like a web page containing links, and we (people) navigate to these links once we need them. In software service, we can imagine having a User resource. Once the client requests a specific user, we return data, including more resource links to details about the user. If a client needs these details, it can navigate and request more data or take action using these links.

The advantage of HATEOAS is that being able to change the implementation details of the links. We can change the behavior entirely without needing a change in the client. However, if we perform a fundamental change in the action (link) or remove the action from the content, we can break consumers.

One trade-off is having back-and-forth communication between the client and server. The client needs to navigate around the actions and follow the links in the responses. The main suggestion is to let the client navigate around and optimize later on when necessary.

### Beware Too Much Convenience

"How we decide to store our data, and how we expose it to our consumers, can easily dominate our thinking."

One recommendation is that until we understand consumer needs, we can leave the database out and use a text file. Once we know the data format that satisfies the consumer, we can choose the technology and how we store it.

### Downsides to REST Over HTTP

- Client stub generation is not as easy as RPC.
- All HTTP verbs are not well-supported in some web frameworks.
- The performance is not even comparable with a binary protocol like Thrift. In low-latency requirements, HTTP overhead may be a burden. The alternative protocols built on top of TCP or similar can be more efficient. If extremely low latency is essential, we can pick UDP for server-to-server communication, and many RPC frameworks run it very well.
- Payload consumption requires more work than some RPC implementations. Data serialization and deserialization are extra work.
- If you want to learn more, check out [REST in Practice](https://www.oreilly.com/library/view/rest-in-practice/9781449383312/).

## Implementing Asynchronous Event-Based Collaboration

### Technology Choices

The vital point is considering two parts: a way to emit events from our microservices and a way for our consumers to receive these events.

There is an option of using message brokers as middleware. Message brokers are built scalable and can help. However, we need to know what we are getting. So we should keep our middleware simple and move logic to the endpoints.

### Complexities of Asynchronous Architectures

We need to be careful about adopting our systems to event-driven architectures and asynchronous programming. Their complexity requires having a robust setup with correlation IDs (distributed tracing) across process boundaries.

## Services as State Machines

Thinking of the services as state machines is a powerful method regardless of REST or RPC choice. Having the lifecycle of the domain enables us to add new behavior easily, manage the state of the system from one place and understand what's there.

## Reactive Extensions

Reactive Extensions (Rx) revert the traditional data flows. The conventional mechanism of asking for data and waiting for a response turns into observing the result of either blocking or non-blocking operation(s) and performing actions when something changes.
