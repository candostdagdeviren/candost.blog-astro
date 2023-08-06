---
title: "How to Approach Software Architecture Design"
description: "How an architect thinks and approaches designing and architecting software systems? The architect's job is eventually a combination of tech lead, software engineer, R&D engineer, and strategist. But how do these responsibilities come together?"
tags:
  - software-engineering-system-design
date: 2021-08-17
updateDate: 2021-08-17
external: false
---

[If you prefer listening, I have a podcast episode where I talk all about this article.](https://mediations.candost.blog/p/20-software-architecture-design-systems-903)

I [talked and wrote](https://mediations.candost.blog/p/19-software-architect-role-and-archicture) about the software architect role before. The architect's job is eventually a combination of tech lead, software engineer, R&D engineer, and strategist. But how do these responsibilities come together? Working on architecture is a combination of a comprehensive set of skills. This article will discuss what an architect thinks and how an architect approaches the problem before starting with the design.

We need to understand what type of architecture we are talking about before we dive.

## Architecture Types (Size)

There are (roughly) two types of systems we can come across while talking about software architecture: application and enterprise.

Application architecture focuses on the modularization of an application: grouping related code together into modules. Wait. What is an application in this context? Martin Fowler [defines](https://martinfowler.com/bliki/ApplicationBoundary.html) it as social construction:

> "A single unit that's been seen as a single unit from developer's, customer's and manager's perspective."

All of these are social elements of the software, thus a social construction.

The [enterprise architecture](https://martinfowler.com/bliki/EnterpriseArchitecture.html) focuses on finding an architecture that many applications will fit. I won't go into details of enterprise architecture. But I can't leave without saying that it involves a lot of politics because those many applications teams won't want to fit in that specific architecture. So, a wise thing for an enterprise architect is to design the system with a minimum impact on application teams. If an architect comes up with a generic approach that requires a drastic change in the application architecture, the team, of course, will be hesitant to change.

In this article, when I say architecture, I mean application architecture.

## Architecture Characteristics (System Quality Attributes)

Another type of political discussion happens inside an architect's brain: defining the most important characteristics of the system.

It is one of the most challenging parts of designing the system. Having [84 characteristics](https://www.wikiwand.com/en/List_of_system_quality_attributes) doesn't make it easier as well. If we name a couple of them, these characteristics include, but are not limited to, reliability, availability, scalability, testability, and recoverability—in short, '-ilities'’

Deciding on the essential characteristics involves understanding business requirements, company strategy, and team structure (wink wink, Conway's Law). Even more difficult is some of these -ilities come as a group. For example, when an architect chooses agility as the most crucial characteristic, the decision is seven: debuggability, extensibility, portability, scalability, securability, testability, and understandability.

There are also subsets of characteristics that are important for different parts of the systems. For example, reliability, availability, scalability, and recoverability (RASR) are essential for databases, while reliability, availability, maintainability, and safety (RAMS) are crucial for safety-critical systems.

I hear some of you saying, "Why don't we support all of these characteristics? Why do we have to fight over them?". Well, just designing to support one extra characteristic adds a lot of complexity to the design. Furthermore, choosing one attribute usually requires a sacrifice from a couple of other attributes--the game of trade-offs.

If performance is the most critical thing for you, and when you add safety as an extra characteristic, you will hit some problems with performance, as the safety will require you to take additional controls in every step. So increasing safety does not only mean a sacrifice from performance but also means more complicated architecture.

There is one thing that Agile methodology pushes for and also makes sense for software architecture design: iteration. Strive to design architecture as iterative and changeable as possible. You can't create the best architecture (well, trade-offs 🤷), and you definitely won't be able to prepare for every potential problem.

Additionally, business requirements constantly change. Because of this, if you can change your architecture without significant issues, you will be able to fix those issues when you face them.

Designing the best architecture is impossible since we make mistakes, and everything is apt to change at any time. That's why

> "Never shoot for the best architecture, but rather the least worst architecture." - [Richards & Ford](https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/).

Okay, but how do you come up with the least bad architecture?

## Design Thinking

When [David Kelley changed the perspective of design thinking](https://www.fastcompany.com/1139331/ideos-david-kelley-design-thinking) in products, the design became [a complete process](https://www.slideshare.net/Extentia_IT/software-architecture-and-design-thinking). Before, the design was separated into multiple steps, and various people worked in different stages. Kelley popularized the phrase "design thinking" and defined it as an iterative process and human-centric activity. Kelley put the human in the center of the design and process and became "designing behaviors and personalities in the product."

"How does it relate to software architecture?" you may ask right now.

Although Kelley was not directly talking about software architecture, Kelley's contribution is incredible when we approach the design as a process with the same principles.

In Kelley's process, there are five steps: empathize (understand), define (observation), ideate (brainstorming), prototype, and test.

A software architect starts with empathizing: understanding the full context. It's time to gather all stakeholders and requirements together to ponder and comprehend the problem that's on focus. Starting the designing phase with empathy through the problem and not the solution keeps the thinking open.

After understanding the requirements and the need, the next step, which many people skip, is defining the exact problem. Not specifying the problem statement paves the way for issues, rework, and failure. Additionally, the stakeholders often don't know what problem they are facing. Therefore, this step usually brings clarity to the whole design.

At first look, brainstorming may make more sense when generating new ideas; however, it's also an excellent strategy for software architecture. Having all requirements and a prescribed problem enables exceptional brainstorming. Getting together with the right people allows the architect to find a conclusion to the problem. Ideating the possible solutions (yes, more than one) empowers the following steps; prototyping and testing.

Creating prototypes and forming an iterative process to test them is crucial for success. Again, the key is iteration. Having the prototypes is only a starting point for an architect. The iteration and testing will improve everything, and the architecture will become more ready to use in the project.

Although design thinking is a creative process and usually aims to find the best solution, the reality for software architecture is still finding the least worst one. It's also why during these five stages, keep in mind [two principles](https://www.slideshare.net/Extentia_IT/software-architecture-and-design-thinking).

## Feasibility and Viability in Software Architecture

The first principle is feasibility: is the solution practical? The ideas and prototypes have to be feasible. The software architect helps the software engineering teams to fail fast with ideas and solutions. If the teams cannot implement the ideas or prototypes with software systems, it's better not to spend time on them.

The practicality also requires assessing the testability of generated concepts. If an idea is not easily testable, the result will be unattainable and, therefore, unpractical.

The other principle is the viability of the solution. If an idea or prototype cannot become a part of a sustainable business model, there is no point in pursuing it. A good software architect knows and understands the company's strategy, goals, teams, and technical limitations. This knowledge will help to test the viability of solutions.

These two principles have to be at the back of an architect during the system design phase.

Now, we know design thinking and how to approach problems. Thus, it's time to talk about system design.

## System Design

I won't get into the technical details of system design because the design varies depending on the system you are working on. However, some elements are part of every system design process.

The first one is holistic thinking. An architect uses holistic thinking to understand the problem and the context. Holistic thinking requires looking for the connections between different parts of the problem. While looking at the whole picture, the architect tries to modularize the system in different ways. Holistic thinking is the must-have strategy, especially in the first stage of design thinking, empathize. Holistic thinking enables an architect to modularize the system efficiently.

Modularity (grouping related code or pieces into modules) is another critical element in architectural design. The architect modularizes the system to solve smaller pieces first and then moves to the bigger parts (inductive approach). In this move, the architect looks for parts that need to connect.

Understanding the problem requires holistic thinking, and coming up with a solution requires an inductive approach.

The last important element is Conceptual Integrity: using one design style in the whole architecture instead of using different ones in different system sections. In the famous book The Mythical Man-Month, Frederick Brooks Jr. says:

> "I will contend that Conceptual Integrity is the most important consideration in system design. It is better to have a system omit certain anomalous features and improvements, but to reflect one set of design ideas, than to have one that contains many good but independent and uncoordinated ideas." - Brooks Jr., Frederick P.. [Mythical Man-Month](https://en.wikipedia.org/wiki/The_Mythical_Man-Month), Anniversary Edition, The (p. 56). Pearson Education. Kindle Edition.

Brooks takes one more step and claims that the system design must be created by a single mind or a tiny group. Because Conceptual Integrity cannot be achieved in a big group in which people have group dynamics. Conway's Law supports this:

> "Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure." — [Melvin E. Conway](https://en.wikipedia.org/wiki/Conway%27s_law).

If the architect group is big, the design they produce will also include their communication structure. Achieving Conceptual Integrity between modules formed by holistic thinking and an inductive approach requires either a single mind or a tiny group.

## Last Words

Choosing the most suitable architectural characteristics in the application architecture is one of the architects' most difficult decisions. Architects shouldn't aim to create the best architecture; instead, they should aim to have the least bad and most changeable architecture. The design thinking process is the life source for architects to achieve Conceptual Integrity. Using holistic thinking and an inductive approach in various stages of design thinking will also enable architects to [quickly test their ideas](/bias-towards-action/) and filter solutions that are not feasible or viable.
