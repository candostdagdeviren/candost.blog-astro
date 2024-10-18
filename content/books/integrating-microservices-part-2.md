---
title: "Building Microservices: Integration of Microservices - Part 2"
description: "The most important aspect of technology correlated with microservices is integration. When we get it right, microservices are autonomous and independent. If we get it wrong, the risk of catastrophe increases."
date: 2021-03-09
updateDate: 2021-03-09
external: false
---

This post is Chapter 4, Part 2 of my notes from the book [Building Microservices: Designing Fine-Grained Systems](https://samnewman.io/books/building_microservices/).

1. [Chapter 1: Microservices and Their Benefits](/books/microservices-and-their-benefits/)
2. [Chapter 2: The Evolutionary Architect](/books/the-evolutionary-architect/)
3. [Chapter 3: How to Model Microservices](/books/how-to-model-microservices/)
4. [Chapter 4, Part 1: Integrating Microservices](/books/integrating-microservices-part-1/)
5. [Chapter 4, Part 2: Integrating Microservices](/books/integrating-microservices-part-2/)
6. [Chapter 5: Splitting the Monolith](/books/splitting-the-monolith/)

---

## DRY and the Perils of Code Reuse in Microservice World

Whatever it takes, we should avoid overly coupling microservice and its consumers. A small change to the microservice shouldn't cause unnecessary changes in the consumer.

A potential form of coupling occurs if our shared code leaks outside of the service boundary. Common code usages like logging libraries are acceptable because they are not visible from the outside world. One solution to prevent leaks might be using service templates to bootstrap new service creations. Including everything we need in the template keeps us safe.

> Don't violate DRY within a microservice, but be relaxed about violating DRY across all services.

Too much coupling is worse than code duplication.

### Client Libraries

When considering writing client libraries, separate client code to handle service discovery and failure from things related to the service itself. More logic in the client library means breaking down more cohesion.

## Access by Reference

In event-based communication, when events happen, we need to know what happened. When we receive and events that inform an updated resource, it is useful to understand how the resource was before the update. Adding a reference to the entity is helpful so that we can also look up its current state.

We are making trade-offs here. If we always access the entity by reference, we increase the load on the service. However, when we receive the event, we can get additional information about what was the resource's state when an event happened. If we know how long we can consider the information as fresh, we can cache the resource load. (HTTP has a variety of cache control support)

There is no one-solution-to-all. We need to be careful when passing the data around when we don't know its freshness.

## Versioning

### Defer It for as Long as Possible

> The best way to reduce the impact of making breaking changes is to avoid making them in the first place.

Another way to delay the breaking change is to assist our services' consumers by not binding too tightly to our services.

> "Be conservative in what you do, be liberal in what you accept from others." - Postel's Law

### Catch Breaking Changes Early

Consumer-driven contract testing is a good helper here. If we support multiple consumers, we can use run tests using these consumers against the latest version of the service.

### Use Semantic Versioning

It's not commonly used in distributed systems. However, use semantic versioning either in the full service or in a single endpoint.

### Coexist Different Endpoints

After staying away from introducing a breaking change, the next thing is limiting the impact. We don't want to force our consumers to upgrade in lock-step with us. Our goal is to release microservices independently of each other.

One way of decreasing the impact is coexisting the old and new interfaces in the same running service. We can release the new interface without impacting the consumers. And they can switch to a new one independently. Once they all use the new one, we can remove the old interface from our services. In this way, we phase our breaking changes in.

### Use Multiple Concurrent Service Versions

This approach is another not-so-great one; however, it exists. Netflix uses it rarely. The idea is to keep the old and new versions of the systems live at once as separate services accessing the same database.

The problem with this approach is once we discover a bug, we need to fix and deploy two different services. Simultaneously, directing the traffic appropriately to these services requires a lot of configuration—also, the complexity of data persistency increases.

## User Interfaces

Constraints from the web and mobile clients are very different. Although our services provide the same functionality, we need a way to adapt our services to these constraints.

There are a few models to do this.

### API Composition

Exposing our APIs to mobile and web clients is one way. This way, the clients can use whichever service they need. However, there are some downsides to this approach.

First, we cannot adapt the response to the devices we serve. Since everyone gets the same response, some clients can get the data they don't need. One solution is letting customers specify the fields they want.

Second, creating the interface is tricky. Who will create the user interface? If some other team is building the UI, we welcome layered architecture where making a change requires multiple team collaboration.

Lastly, communication can increase. Sending a lot of requests from mobile devices is not efficient for the device. It can drain the battery and the data plan of our customers.

### UI Fragment Composition

Our services can provide the UI directly instead of mapping API calls to UI controls. Clients can use the UI we offer, and we can be responsible for these UI elements.

The critical advantage is using the same team for both developing the service and the user interface. However, there are downsides. Ensuring UI consistency might be problematic. Since different people own the UI of various services, aligning them is something we need to be careful about.

Another and more problematic downside is, having native applications or thick clients. We can't serve UI components to them. So, if we need a native application, we don't have another choice of falling back to the setup where the native application makes an API call and handles the UI itself.

### Backends for Frontends (BFFs)

This approach is one solution to reduce the chattiness between the API provider and the clients. It can aggregate content and serve it as well. However, it might easily lead to disaster when these endpoints become very thick and keep too much logic inside. Separate teams start managing them, and this means we have coupled teams.

Instead of having one service to serve multiple clients, we can have smaller services (BFFs) where any UI team handles its service itself. The problem with this is that the service can hold the logic it shouldn't have initially. They should only consist of functionality to deliver a specific user experience, not more than that.

### Hybrid Approach

The approaches mentioned above can be mixed and used together for different services. However, be careful and keep the logic of the service inside the service.

## Integrating with Third-Party Software

> "Build if it is unique to what you do and can be considered a strategic asset; buy if your use of the tool isn't that special."
