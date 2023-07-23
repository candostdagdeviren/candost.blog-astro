---
title: "Building Microservices: How to Model Microservices"
description: "The goal of modeling microservices is to have loose coupling and high cohesion. Don't directly go with microservices. Start monolithic and evolve to microservice."
tags:
  -
date: 2021-01-23
updateDate: 2021-01-23
external: false
---

This post is Chapter 3 of my notes from the book [Building Microservices: Designing Fine-Grained Systems](https://samnewman.io/books/building_microservices/).


1. [Chapter 1: Microservices and Their Benefits](/books/microservices-and-their-benefits)
2. [Chapter 2: The Evolutionary Architect](/books/the-evolutionary-architect)
3. [Chapter 3: How to Model Microservices](/books/how-to-model-microservices)
4. [Chapter 4, Part 1: Integrating Microservices](/books/integrating-microservices-part-1)
5. [Chapter 4, Part 2: Integrating Microservices](/books/integrating-microservices-part-2)
6. [Chapter 5: Splitting the Monolith](/books/splitting-the-monolith)

---

## What Makes a Good Service?

Loose coupling and high cohesion.

### Loose Coupling

Changes in one service should not require a modification in another service.

Making the services independent is one of the crucial rules of microservices. We need to make a change in one service and deploy without changing the others.

### High Cohesion

High cohesion is highly related to loose coupling. We want to have associated behavior together and independent ones separated. When we need to change something, we shouldn't be deploying many services to deliver that change.

## The Bounded Context

> "A specific responsibility enforced by explicit boundaries."

Having specific boundaries and models defined only for external communication and hiding internal things is a good concept. When we separate internal functionality and models from the outside, we can act more freely, and the external services will never know what's going on inside. It's like a company. Customers never see what's happening behind the scenes; they only care about the result or look at the interface opened for them.

### Modules and Services

Being careful about what models to share with consumers is essential. When we don't think clearly, we fall into creating tightly coupled systems.

Microservices should be aligned with bounded contexts.

One recommendation:

> "When you're starting out on a new codebase and once you have found your bounded contexts in your domain, make sure they are modeled within your codebase as modules, with shared and hidden models."

### Premature Decomposition

Don't split the service into microservices too quickly. Let it show itself. Start with the monolithic approach, not with microservices.

## Business Capabilities

First, identify what the context does. Then find out what data the context requires to do its job.

## Turtles All the Way Down

When thinking about boundaries and exploring how to benefit from splitting the domain, start from bigger contexts and separate them.

There is no one-rule-for-all. The separation depends on the organization's structure. If there is one team responsible for all parts of the service, find nested bounded contexts and separate them within the service. If multiple teams are responsible for different parts of the service, split those bounded contexts into other microservices. Teams deserve to have their own services.

### Communication in Terms of Business Concepts

The changes come from business requirements and wishes. If we have divided bounded contexts in our services, the business changes will most likely also be reflected in these separations.

The communication between services also echoes the relationship between teams. If there are close relationships and shared responsibilities between teams, this situation should reflect on the services' interfaces.

## The Technical Boundary

Depending on the situation, separating services with technical boundaries may work. If the organization is looking to achieve some performance objectives, it makes sense. However, this kind of separation should be the second goal, not the first one. Because when technical boundaries are split across multiple teams, navigating a change becomes hard: teams depend on each other, and making a change requires several teams' work.
