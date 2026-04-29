---
title: "Learning Domain-Driven Design Part I: Strategic Design"
description: "Chapter notes from Learning Domain-Driven Design Part I: Strategic Design"
tags:
  - chapter-notes
  - domain-driven-design
date: 2026-04-29T06:16:00.000+01:00
updateDate: 2026-04-29T06:16:00.000+01:00
---

The tighter the connection between business strategy and technical design, the easier for a software engineer to understand and implement. The more apparent this knowledge is, the easier for the AI to pick up and apply the principles and engineer to guide it correctly.


## Chapter 1. Analyzing Business Domains

While designing and building software, engineers must understand the problem they are solving. To understand the problem, they must understand the context in which the problem exists. The context always comes from the business strategy and domain, and the value that it seeks to gain by building the software.

Business Domain: Main activity of the company. For a FinTech, processing payments; for a delivery service, it's the courier delivery; for a coffee shop, it's the coffee.

Subdomain: A detailed area of business activity. Building blocks of the system. In e-commerce, there are subdomains such as accounting, billing, dunning, payment, order tracking and shipment.

### Subdomains

> I think this part is the crux of understanding business strategy and domain boundaries. Subdomain separation has to be glued with the business strategy (considering you have one). If the business is unclear—such as in early-stage startups without product-market fit—talking about domain-driven design is inadequate.

In conjunction with having product market fit and multiple teams working in the engineering department, untangling subdomains becomes mandatory.

There are three types of subdomains: core, generic, and supporting subdomains.

#### Core subdomains

Think of this as the domain that gives the company a competitive advantage. If we consider Amazon, its core subdomain is probably not the payment processing system, but rather the warehouse and shipment management and customer support. Seamless payment processing and offering all possible payment methods is crucial to Amazon's success, but it's most likely not its core subdomain after they support majority of payment methods.

Core subdomains, by nature, are complex. This only makes sense: if it were easy, competitors would have already replicated it, and the company would lose its competitive advantage. Using Amazon again, if everyone were as efficient as Amazon's customer service or warehouse & shipment management, we would not be talking about Amazon today.

Core subdomains are not necessarily technical (unless it's selling digital products), as is visible from the Amazon example.

#### Generic subdomains

Think of this as the domain that every company has, such as user identity management or an online shop for a physical-goods company (e.g., Nike, Adidas). The online store is not the main driver of Nike's competitive advantage.

Generic subdomains are also complex and hard to implement. However, the company doesn't need to innovate in these subdomains. Consider identity management; every organization has it to manage its users, and the implementation is almost the same everywhere. So, the company doesn't gain a competitive advantage by innovating here. If their core subdomain is not performing well or not creating a moat, there is no value in spending time in a generic subdomain. There are tons of generic, battle-tested solutions available on the market.

#### Supporting Subdomains

Think of these as simple domains that support the core subdomain without providing any competitive advantage to the organization.

If we consider Amazon again, they likely have a shift management software solution to manage staff shifts in their warehouses. That can be a simple system with basic CRUD operations (create a shift, clock in, clock out, etc). That software doesn't create a competitive advantage for Amazon, but it supports the warehouse management and shipment planning.

#### Comparing Subdomains

We can compare the subdomains from three angles: competitive advantage, complexity and volatility.

We discussed competitive advantage extensively above; in short, the core subdomains are _the real_ competitive advantage for a company. They are naturally complex. That said, competitive advantage doesn't only come with user-facing solutions. An e-commerce product can build organizational efficiency that no other e-commerce platform can, reducing operational costs and enabling cheaper sales. The organizational efficiency becomes their competitive advantage.

When it comes to _complexity_, the core and generic subdomains are both complex, but the supporting subdomains are often simple. The differentiator between core and generic is that generic subdomains don't change often and consist mostly of solved problems that don't require innovation. Core subdomains are naturally complex and continuously evolve (or iterate on) their complexity. If the complexity evolution stops, the competition catches up, and the company loses its competitive advantage.

_(I will open a cross-reference to David Farley's Modern Software Engineering definition: our job is to become experts at managing complexity and at learning. So, the modern software engineering definitely supports this definition.)_

Differentiating core and supporting subdomains is more difficult than separating generic subdomains. The main question to ask is: would someone pay for a domain on its own? Can we spin off a company only with the specific subdomain? If yes, it's a core subdomain.

Supporting subdomains are often so simple that other organizations can quickly build or outsource. They are often simpler to hack and build than to buy from outside.

Generic subdomains are still complex domains, but they are solved problems. They can be bought from outside sources (such as Twilio for sending emails or SMS).

The generic and supporting subdomains can also intersect because of their lower volatility than core subdomains. The core subdomains must evolve continuously; they are volatile.

#### Identifying Subdomain Boundaries

_Which domain is a core, which is supporting and where are their boundaries?_

The trick is thinking of this as similar to modular software design. If we aim to make everything into separate modules, that becomes overengineering without bringing any value. So, we must find the balance.

The core domains need to be drilled down as deeply as possible to separate the generic and supporting subdomains.

The generic subdomain, however, will not provide benefits when split into more generic subdomains.

We have to find the most coherent core subdomains that are complex and volatile, so we can put our attention to it to keep a competitive advantage. While doing so, we should get rid of the technical mindset and think in terms of business. Although a CEO can rarely tell their product’s domain boundaries when asked, the organizational design, organizational rituals and strategy are good places to start identifying core subdomains.

### Domain Experts

Domain experts are the people engineers and analysts solve problems for. They represent the business; they are the ones who identify the business problem and from whom the knowledge originates. They are either the end users of the software or the people coming up with requirements.

They hold the domain expertise. That's why engineers must stay close to these people to [solve _the right problem_](https://candost.blog/solving-problems-worth-solving/).

## Chapter 2. Discovering Domain Knowledge

Sharing knowledge between domain experts who know the problems and engineers who build solutions is key. Understanding the business domain problems requires _using a common language between domain experts and engineers_. This language should not be translated by an analyst or product owner. Instead, it must be a shared language that explains the business domain _without any technical jargon_.

This language is called **_ubiquitous language_**.

In software development, we often talk about the stages: discovery, design, implementation and delivery. The first part (the discovery) includes identifying the ubiquitous language—establishing a shared mental model of the problem and starting to speak the same language. This shared language must be used across the board by all the people, software engineers, product owners or managers, domain experts, designers, quality assurance, etc.

The _ubiquitous language must be explicit, precise and consistent_ without ambiguity. There shouldn't be two terms used interchangeably; one term for one definition (if we're talking about a user while having multiple variations, the definition must clearly say 'visitor,' or 'admin,' or 'user,' etc.)

Only with _ubiquitous language as a communication tool_ can we talk about designing a solution model and implementing it.

### Model of the Business Domain

The book provides a great example of how to define a model.

Think about maps such as terrain, subway and navigation. If you want to go from A to B via subway, a terrain map is not useful; you need a subway map. Similarly, with a subway map, you can't measure the distance between A and B; you need a terrain map.

That's how modeling works. The model isn't 100% objective and explicit representation of what the business is; it's _how we make sense of the business_, and is purposed to solve the problem it is supposed to solve.

A model is not a real copy of the problem; **the model should abstract the complexity of the problem and the domain and bring just enough, and the right, information to solve it.**

The model should represent the domain expert's understanding of the business domain (their mental models), not the engineers'. The ubiquitous language shouldn't try to cover every possible detail of the domain.

There are a few helpful tools to support having a shared ubiquitous language: glossaries and a Gherkin-based test suite.

(I will open two cross-references here. 1) A product requirements document should serve to align everyone on models and a ubiquitous language. If there is a product manager whose job is to understand the domain and choose what to build, they should be accountable for the ubiquitous language, and engineers must be accountable for using the same lingo in the codebase. 2) In Product Management's Sacred Seven book, the authors talk about products evolving over time as the userbase changes and changing the product design with the userbase. I see a strong correlation between finding the right product design and identifying the ubiquitous language and domain modeling_. In the end, solutions to most problems aren't techy.)

## Chapter 3. Managing Domain Complexity

Domain complexity often comes from different domain experts naming the same things differently or naming different things the same. They use similar words to explain completely different things. Hence, all domains get entangled because engineers building these systems also get confused. Sometimes people try to build a grand model that can address the needs of multiple domains.

Solving this problem requires establishing boundaries between domains. We call these boundaries **the bounded context**.

### Bounded Context

A bounded context _is an explicit context assigned to a sub-section of the ubiquitous language_. It aims to create boundaries so that model definitions can stay consistent, explicit, and have a single meaning. Terminology conflicts and implicit contexts are eliminated with bounded contexts.

A model cannot exist without a boundary (a stop on the subway map has a different meaning in a navigation map). The bounded context allows the definition of distinct models, principles, terminology, and business rules that are consistent within its boundaries.

> "A ubiquitous language is ubiquitous only in the boundaries of its bounded context."

A ubiquitous language can't be used without the explicit context in which it can be applied.

For example, if we consider an order in a Point of Sale system's order management software, the order model is a very complex entity that handles items, taxes, fulfillment, kitchen preparation, and many more. However, the same order in the accounting domain means a very different thing, which doesn't involve anything related to kitchen management but only the taxes, money movements and the order's date to account for the order in the books correctly.

Order management and accounting are different bounded contexts, where "order" means very different things in each domain. If we used the same order model for both, we would make the whole system much more complicated than necessary.

Each model needs to be useful in its own bounded context. If we widen the boundary of ubiquitous language, it becomes more difficult to keep it consistent. However, the scope will depend on the domain and the system. Sometimes, keeping the scope wider helps compared to splitting the boundaries and the ubiquitous language.

#### Subdomains vs. Bounded Contexts

Subdomains are _discovered_ based on business strategy. This decision doesn't belong to software engineers; it's about how the organization works and plans its competitive strategy. Software engineers analyze the business domain only to identify subdomains (not to decide).

Bounded contexts, on the other hand, are designed. Choosing models' boundaries is a strategic design decision. We decide how to divide the business domain into smaller, manageable problem domains.

> "Each bounded context should be implemented as an individual service/project, meaning it is implemented, evolved, and versioned independently of other bounded contexts."

> "Each bounded context should be owned by only one team. However, a single team can own multiple bounded contexts."

(A side note: This is where the Inverse Conway Maneuver and team topologies come into play. Also, the idea of DDD is that once you discover these bounded contexts, you can align your teams accordingly and define responsibilities clearly. Although we often see Conway's Law more effective.)

## Chapter 4. Integrating Bounded Contexts

Bounded contexts can be integrated in three ways:

### 1. Cooperation

In cooperation, the teams' successes depend on each other. A single team can't be successful without the other. Hence, don't choose the cooperation method if teams are not geographically co-located, as it requires close collaboration.

Cooperation can be implemented using partnership or shared-kernel approaches.

#### Partnership

Two teams _share the work_. They must collaborate closely on it at all times. When one team changes something in the API, they tell the other team, and the other team changes it too without drama.

#### Shared Kernel

Two bounded contexts keep the same models, but as separate libraries or something similar. While the rest of the bounded contexts differ, the shared model leaks the ubiquitous language and implementation into each context.

### 2. Customer - Supplier

In this collaboration pattern, two teams can succeed independently, although one team has more power.

#### Conformist

The power imbalance favors the upstream team. Downstream conforms to whatever upstream dictates. Downstream accepts the upstream's bounded context and ubiquitous language.

#### Anticorruption Layer

The power imbalance still favors the upstream team, but is slightly countered by the downstream team. When the downstream doesn't accept the upstream's bounded context, the downstream translates the upstream's model into its own bounded context's model by implementing an anticorruption layer (called ACL in diagrams).

This pattern is good when upstream changes are too frequent, or when upstream is inefficient or when the downstream has a core subdomain that needs protecting.

#### Open-Host Service

The power imbalance favors the downstream team. Upstream team decouples its implementation model from the integration model (what they offer to downstream) by adding an open-host service (called OHS in diagrams). This way, the upstream can evolve its internal model at a different speed and publish new versions for the integration model. The downstream can move to a new version of the integration model at their own pace.

### 3. Separate Ways

The last collaboration pattern is going its separate ways, deliberately duplicating bounded contexts across different domains.

This pattern can be used for various reasons, such as organizational design, communication issues, generic subdomains, or the need for different domains in bounded contexts.

### Context Map

A visual representation of the system's bounded contexts and their integrations, aimed at providing insights into high-level design, communication patterns and organizational issues.