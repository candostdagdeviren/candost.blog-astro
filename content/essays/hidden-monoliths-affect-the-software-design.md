---
title: "Hidden Monoliths Affect the Software Design"
description: "Hidden monoliths are everywhere and affect the software system design. When the organization is aware of its software's environment, it can thrive. If not, it faces various challenges."
tags:
  - software-engineering-system-design
date: 2022-10-12
updateDate: 2022-10-12
external: false
---

One of the things I learned and enlightened while reading Team Topologies is there are hidden monoliths everywhere.

Many organizations try to develop fully distributed systems using microservices and have significant problems because they work either in the same office or time zone while using synchronous communication.

Conway's law says organizations will develop systems reflecting their communication structures.

If an organization uses a monolithic office or highly depends on sync communication like video calls, it's difficult for teams to design clear boundaries between systems.

If we extend Conway's law, we can say that whatever monolithic we have will impact our [system design](/how-to-approach-software-architecture-design).

Be it a monolithic CI/CD, monolithic tech stack (org tech standards), monolithic time zone, monolithic way of communication (using video calls all the time), etc.

Also, I'm sure some organizations are aware of these. An organization can be in the same office but mindfully separate teams to prevent unnecessary communication.

These organizations make a conscious choice and deliberately take care of their systems by focusing on hidden structures that affect teams and infrastructure.

On the other hand, some organizations don't even have an office, work asynchronously, and yet, develop [monolithic software](/splitting-the-monolith) (e.g., the old WordPress system).

If the organizations are aware of their hidden monoliths and work deliberately to alter disadvantages or extend advantages, they can create the software effectively.

Many problems occur when organizations don't even sense that their hidden structures affect their software design. They create a goal themselves (e.g., use [microservices](/books/microservices-and-their-benefits), use monolith, use domain-driven design, etc.) and follow their decision without the holistic picture.

_The solution:_ we need to look around the (virtual) office, systems, and pipelines and analyze how they impact the software and team design. If we are destined to obey Conway's Law, how we design the environment in which our software will be developed and maintained will define our system design.
