---
title: "Building Microservices: Microservices and Benefits"
description: "Microservices emerged from continuous delivery, domain-driven design, automation, and small and independent teams. They reflect the real world in the software. But what are microservices?"
tags:
  -
date: 2021-01-10
updateDate: 2021-01-10
external: false
---

This post is Chapter 1 of my notes from the book [Building Microservices: Designing Fine-Grained Systems](https://samnewman.io/books/building_microservices/).

1. [Chapter 1: Microservices and Their Benefits](/books/microservices-and-their-benefits)
2. [Chapter 2: The Evolutionary Architect](/books/the-evolutionary-architect)
3. [Chapter 3: How to Model Microservices](/books/how-to-model-microservices)
4. [Chapter 4, Part 1: Integrating Microservices](/books/integrating-microservices-part-1)
5. [Chapter 4, Part 2: Integrating Microservices](/books/integrating-microservices-part-2)
6. [Chapter 5: Splitting the Monolith](/books/splitting-the-monolith)

---

"Microservices are something that could be rewritten in two weeks." as Jon Eaves mentions. They are small and **focused on doing one thing well**. Yet, the size of the service is always problematic to define. We mostly don't realize it until it gets too big. Software architects and engineers can work on minimizing the service until it no longer _feels_ too big.

_**Feeling**_ **small enough** is the right term.

Microservices are _**autonomous**_. One change in service shouldn't require a modification in another, and both can be deployed by themselves without requiring their consumers to make any change.

## Key Benefits of Microservices

Microservices are all about keeping the balance of these benefits. _Keep the balance right; they are great. Get it wrong; disaster awaits._ In the end, everything is about trade-offs.

- **Technology Heterogeneity**: Autonomous and small independent services enable us to use different tech stacks for each service. **Picking the right tools for the job** instead of a standardized approach fulfills business needs. We can also quickly adopt new technology. However, technological freedom comes with a price; the organizational alignment might suffer.
- **Resilience**: When there is a problem in service, **it should be possible to isolate that point and degrade functionality instead of total failure**. Stability requires constant effort and knowledge of the domain. Considering microservices are small, we build many different services and need to know how to behave when one of them fails. Although resilience is hard, it is one of the most significant advantages of microservices.
- **Scaling**: Monolithic systems have to scale everything together as opposed to small, independent services. When a little functionality has a high load in the system, we only need to scale a specific service. In monoliths, it ends up scaling the whole application, which is more costly. Monoliths require more powerful hardware, which means more money.
- **Ease of Deployment**: In monolithic systems, one small change requires a big deployment. Small services are the opposite. **Every single change requires deployment in only one service.** If the deployment fails, it's also easier to find out the root cause. Releasing the software and rolling back in case of failure also gets faster.
- **Organizational Alignment**: Microservices can quickly adapt to different types of organizational structures. As [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law) says, systems represent organizational structures. However, the reverse of the law is also true. Monolithic systems create big and hard-to-manage organizations. Microservices build small teams. It's well-known in the software world that small groups tend to perform better. Independent and small teams don't wait for each other. With microservices, distributing ownership also becomes more manageable.
- **Composability**: Similar to modules and service-oriented architecture, microservices allow us to reuse functionality. With microservices, consumers can consume our system in different ways for different purposes.
- **Optimizing for Replaceability**: When the services are small, it's also easy to replace. We can easily replace or even delete them.

## What About Service-Oriented Architecture (SOA)?

In SOA, service means an entirely separate system process. Service independence is provided by setting up system communication via network calls rather than handling it in the process boundary.

One problem with SOA is that **there is no good consensus on how to do SOA well**. Many issues associated with SOA happen in service-to-service communication, granulation, and splitting the system in the wrong places.

We can think of microservices as a form of service-oriented architecture. While SOA doesn't help us understand what big means and how to split a big service into small ones, microservices solve most of the SOA problems.

## Other Decompositional Techniques

### Shared Libraries

Shared libraries are a common way to reuse functionality. However, losing technological heterogeneity and independently scaling a part of a system comes at a price. We also cannot deploy changes smoothly unless we don't use dynamically linked libraries.

Shared libraries still keep their place to increase reusability. We can always create common libraries that aren't specific to the business domain or use third-party ones. If we do so, we need to **be careful not to tightly couple** the services.

### Modules

Some languages provide modular decomposition techniques that allow the lifecycle management of modules. These techniques enable deploying modules into a running process. So instead of redeploying the whole service, we can change the running process.

Even though modules take a different approach than shared libraries, we still have disadvantages. **Technological heterogeneity is still not quite possible.** The language or platform either limits us from using new technologies. We are also restricted from how we can scale independently. When one of the functions has a high load, we still have to scale everything. It is also **easier to create highly-coupled systems** using modules.

Technically it's possible to create independent modules within a single monolithic process. However, it often stays in theory. In real life, keeping independence usually fails. The modules start becoming tightly coupled with the rest of the code.

## No Silver Bullet

Microservices have complexities of distributed systems. Even though we know ways to manage distributed systems, it's still hard.

Every organization is different and has different needs. Knowing the pros and cons of microservices help to decide if it's a fit or not. It's still not a silver bullet to solve all problems.
