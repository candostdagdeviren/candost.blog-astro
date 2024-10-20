---
title: "Building Microservices: The Evolutionary Architect"
description: "Comparing software architects with actual architects is inaccurate. Physical-world constrains architect, and software evolves with user requirements."
date: 2021-01-20
updateDate: 2021-01-20
external: false
---

This post is Chapter 2 of my notes from the book [Building Microservices: Designing Fine-Grained Systems](https://samnewman.io/books/building_microservices/).

1. [Chapter 1: Microservices and Their Benefits](/books/microservices-and-their-benefits/)
2. [Chapter 2: The Evolutionary Architect](/books/the-evolutionary-architect/)
3. [Chapter 3: How to Model Microservices](/books/how-to-model-microservices/)
4. [Chapter 4, Part 1: Integrating Microservices](/books/integrating-microservices-part-1/)
5. [Chapter 4, Part 2: Integrating Microservices](/books/integrating-microservices-part-2/)
6. [Chapter 5: Splitting the Monolith](/books/splitting-the-monolith/)

---
Comparing software architects with architects is inaccurate. Physical-world constraints architects while the software is designed to evolve with user requirements. Maybe the most harm caused by the word _architect_.

## An Evolutionary Vision for the Architect

We tend to assume that the software we develop will live forever as it is. But whenever we finish the task at hand, it already becomes out-of-date or produces technical debt. We need to design systems that are changeable because of the nature of our work. We're not civil engineers, and we're not building one building to let it stand for many years.

Software Architects are more like town planners. Town planners don't plan every building; they specify zones. Industrial facilities can only be in industrial zones. Town planners try to fulfill the citizens' current needs while keeping the future in mind. This approach is applicable not only to software architects but also the organizations without that specific role. The idea of planning a city is very similar to software planning or software development in teams. The teams can build beautiful buildings. But it's a software architect’s role (or a shared practice in some organizations) to keep the city beautiful by putting some limitations around it.

Changeability is often ignored in software architecture design. We try to create loose-coupled systems or modules. But in the end, we build our whole system to stay put. We don't make the bigger picture easily replaceable.

## Zoning

Software architects should worry more about what happens between services rather than what's going on inside the service.

> **Guideline:** Be worried about what happens between the boxes and be liberal in what happens inside.

The architect must be sitting with the team and working on regular stories. It helps the architect to understand what everyday work looks like. This method is more effective than having a meeting or reviewing the code.

> **The Coding Architect:** "Ideally, the architect should work on normal stories, to really understand what _normal_ work is like. I cannot emphasize how important it is for the architect to actually sit with the team! This is significantly more effective than having a call or just looking at the code."

## A Principled Approach

### Strategic Goals

Strategic goals are overall and high-level company goals that might not include technology. These goals can be defined at the company or division level.

### Principles

Principles are the rules. These rules are aligned with strategic goals. They are not the same as goals but rather define the directions on how to achieve these goals. Principles can and will change in time. For example, if the company wants to quickly deliver new features to the market, principles can be making teams independent to prevent groups from blocking each other.

### Practices

Practices are detailed and practical guides to ensure the principles are followed. Due to nature, practices are more technical. Therefore, it can also change more often than principles.

> "Practices should underpin our principles."

### Combining Principles and Practices

The value of having principles is showing people where we would like to go. The practices are there to help people how to implement the ideas stated in the principles.

## A Required Standard

Defining a standard is like answering, "What is a 'good citizen' service in your system?" It is one of the key points to defining explicit attributes that each service should have.

### Monitoring

There has to be a common practice for both logging and monitoring.

It doesn't matter whether you push data into one service or pull from all services to a central location, pick one and use the standardized way everywhere.

Make the monitoring box opaque.

### Interfaces

Pick one or a maximum of two standard interface technologies. It helps integrate new consumers easily.

### Architectural Safety

Shield the service from failures that happen in underlying systems.

## Governance Through Code

Agreeing on how things can always sound like a good idea. But following decisions and seeing them implemented is a dreading task. There are two methods to help people to follow these decisions: using examples and templates.

### Exemplars

Don't hesitate to write an example code. Written documentation is good, but when you support it with code, the developers tend to understand better or have a higher interest. Also, the developers can run and explore the standards or best practices we encourage.

### Tailored Service Template

Templates and including all the decided set of development practices inside is a great way to kickstart a project. The template makes everything way more straightforward in the beginning. It handles the groundwork, and the focus can move on to developing the service itself directly. Maintaining the template is a collective activity that team(s) should take joint responsibility for updating.

## Technical Debt

When we deviate from our technical vision or change it, we create technical debt. One job of the architect is closely following this situation and keeping the balance. An architect should look to the bigger picture and understand the trade-offs and when to keep the balance.

## Exception Handling

It’s possible to have exceptions in the overall system. When our systems deviate from principles and practices, we start creating exceptions. One way to make sure we can react to these changes is by keeping a list of exceptions. If there are enough exceptions, it may be wise to change the principles or practices and reflect the new understanding of our work.

## Governance and Leading from the Center

> “If one of the architect's jobs is ensuring there is a technical vision, then governance is about ensuring what we are building matches this vision, and evolving the vision if needed.”

There should be a group of people from every team (most likely the lead), and the architect should chair this group.

## Building a Team

Growing people in monolithic systems are more challenging than microservices. Owning a system and shaping the implementation and the vision in microservices are more comfortable than monolithic systems. In microservices, we create autonomous codebases with independent lifecycles to support people to own the full service and significantly impact the overall system. This way, we enable people to step up in their careers.

## Summary

The evolutionary architect's core responsibilities are vision, empathy, collaboration, adaptability, autonomy, and governance.
