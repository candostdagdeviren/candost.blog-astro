---
title: "Building Microservices: Splitting the Monolith"
description: "Don't split the monolith for the sake of having microservices. Use incremental approach."
tags:
  -
date: 2021-05-28
updateDate: 2021-05-28
external: false
---

This post is Chapter 5 of my notes from the book [Building Microservices: Designing Fine-Grained Systems](https://samnewman.io/books/building_microservices/).

1. [Chapter 1: Microservices and Their Benefits](/books/microservices-and-their-benefits)
2. [Chapter 2: The Evolutionary Architect](/books/the-evolutionary-architect)
3. [Chapter 3: How to Model Microservices](/books/how-to-model-microservices)
4. [Chapter 4, Part 1: Integrating Microservices](/books/integrating-microservices-part-1)
5. [Chapter 4, Part 2: Integrating Microservices](/books/integrating-microservices-part-2)
6. [Chapter 5: Splitting the Monolith](/books/splitting-the-monolith)

---

Identifying the bounded contexts is the first place to start. We want to identify the seams that can turn into service boundaries. When we look at the codebase, we sometimes easily separate some sections. Some of the code doesn't easily separate from other parts. This code will point out the bounded context we missed.

Don't split the monolith for the sake of having microservices. Use incremental approach. It will help you learn more about microservices as you go and will limit you from making mistakes. Think about how to get the most benefit from some part of the codebase by separating it.

## The Reasons to Split the Monolith

- Pace of Change
- Team Structure
- Security
- Technology

## Refactoring Databases - Staging The Break

Separate the schema but keep the service together. After that, split the application code into separate microservices.

## Transactional Boundaries

Transactions are useful. They enable us to connect events together and help us to manage the state more efficiently. Especially in database operations, they allow us to update multiple tables at once, knowing that if anything goes wrong, everything will be rolled back so that we won't end up with an inconsistent state.

What happens when we have to split a single transaction in a monolithic schema while separating databases, and something goes wrong?

Imagine two database operations in one transaction happening sequentially. We split our database schema into two schemas. Now we have two separate transactions. If the first transaction fails, we cancel the whole operation. But what do we do if the first one is successful and the second one fails? There are a couple of strategies.

### Try Again Later

If the completion of the first operation is enough for now, we can set up a system to try the second operation later. We assume that the system will eventually be consistent rather than ensuring that the system is in a consistent state.

### Abort the Entire Operation

We can abort the entire operation. Our first transaction was successful. Therefore, we need to unwind this operation to go back to a consistent state. We have to issue a compensating transaction by kicking off a new transaction to roll back what just happened.

### Distributed Transactions

In this method, there is one transaction manager that orchestrates the various transactions. It works with a two-phase commit. The first phase is voting. The manager asks all participating local transactions to give a "Yes" signal that indicates the operation can go ahead. If the manager gets yes from all participants, it tells all of them to perform. Getting one no vote is enough to cancel the operation, and the manager sends a rollback message to all parties.

There are various problems with this method. What happens if the transaction manager goes down? The whole system is blocked. If one local transaction fails to give a vote, everything is blocked. And also, what happens in a case where a local transaction gives a yes vote but the actual commit fails?

Another problem is resource locks. Pending operations can lock the resource and lead to contention and making scaling systems much more difficult.

If you choose this strategy, do a lot of research first, A LOT! Don't reinvent the wheel here. Use existing distributed transaction implementations.

### So What to Do?

If you have a state that really wants to stay consistent, do everything you can to avoid splitting it up in the first place. Do whatever you can. If you need to split, move away from a purely technical view of the process and create a concept to represent the transaction itself.

## Data Pumps

In reporting or analytics systems, we can pump the data to these systems rather than pull data from other systems.

The team that manages the services should build and manage the data pump as well. It can be straightforward. The pump's job is mapping from the internal database to reporting schema. Since the data pump and the service work closely together, version-control them together, and deploy them together. Don't open access to the schema outside of the service team.

## Event Data Pump

We can emit events to our own database. The event data pump can use state changes in the services to populate a database. If we also store which events are processed, we can only send deltas to our database to be more efficient. With this approach, we decouple the underlying service and our reporting. We only bind events emitted by the service.

The downside of this approach is the disability to scale as well as a data pump for larger volumes of data that can operate on the database level because all the required information must be broadcast as events.

## Cost of Change

Every change comes with a cost. When we split the monolith, we are making bigger changes in the system. It's natural to make mistakes, and we should embrace them. On top of that, we need to understand how best to mitigate the costs of these mistakes.

Where is the cost of mistakes and cost of change minimum? In the design stage: the whiteboard (or paper). Run the use cases across your design on the whiteboard and see your flaws the earliest.

Write down the responsibilities, capabilities, and collaborators of service to index cards (similar to class-responsibility-collaboration cards) and work through your use cases using these cards.

## Understanding Root Causes

The key is knowing it needs to be split before the split becomes too expensive.

Splitting the monolith might be a big and challenging job. One side of the problem is not knowing where to start. In this chapter, we learned some ideas about where we can begin the split.

If we think we are making something right but face difficulties, we should strive to make things easier. Look for libraries and lightweight service frameworks to reduce the cost of creating a new service.
