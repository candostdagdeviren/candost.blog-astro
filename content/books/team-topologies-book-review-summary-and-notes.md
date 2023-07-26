---
title: "Team Topologies Book Review, Summary, and Notes"
description: "Team Topologies book is driven by Conway's Law and Inverse Conway Maneuver to help us understand how teams collaborate and communicate."
tags:
  -
date: 2022-12-22
updateDate: 2022-12-22
external: false
---

> **How Strongly I Recommend:** 9/10
>
> **How likely I will gift it to somebody:** 8/10

## The Review

The book is short but very dense. It took me a while to finish it because I had to stop and think about the practical applications of concepts.

The four fundamental team topologies and interaction modes help us understand how we want to design our teams. For example, if I'm leading a platform team, I must take action to reduce synchronous communication (meetings, face-to-face, etc.) between my team and our consumer teams. Because these direct communication lines will result in bad documentation and developer experience of the platform we develop. If we rely on meetings to explain how to use the APIs, we will never set time aside to improve documentation.

The main ideas the book is driven from are Conway's Law and Inverse Conway Maneuver. These two helped me to grasp how system designs work and how we can achieve our target team structure and system design. Although systems, teams, and business should go hand in hand, it rarely happens. Often technical design cannot follow structural changes in the organization. We often do re-organizations to adapt to changing business environments. But it's difficult to change system design as quickly as organizational design. Having frameworks like team topologies help to find shared language and mindful action while redesigning the organization.

### Why should you read it? (Why I recommend it)

I recommend this book because it taught me a framework I could use daily while collaborating with other teams. After reading the book, I have a better understanding of how to structure my team and how to collaborate with other teams. If your team collaborates with others on a more ad-hoc basis and without any structure, you should read this book.

## The Summary & Chapter Notes

### The Problem with Org Charts

The static nature of the organizational chart prevents organizations from clearly seeing their workstreams and communication lines. The problems grow as the organization becomes more org-chart-driven. As organizational charts rarely reflect which collaborations are needed to get things done, leaders often do reorganizations to meet changing business needs. These reorgs have significant consequences because they avert teams from getting to know each other and working efficiently.

When organizations rely on org charts to align with each other to drive multiple projects, teams' accountability doesn't reflect reality. In cross-team projects, it becomes unclear who is accountable for what. In the end, reorganizations only look good on paper, like org charts.

#### The Conway's Law

> "The organizations design systems in a way that reflects and is constrained by their communication structures." — Melvin E. Conway

This law has held true since 1967.

Software development methodologies have evolved over the years. Earlier, the software architects were handing over architecture blueprints to the teams. That was because the software architect was not part of the team, and the responsibility was not separated among certain people.

After many stages, microservices architecture emerged and reversed Conway's law. Microservices architecture enabled organizations to design teams in a way that they plan their target architecture instead of designing the architecture reflecting team structures. This is called Inverse Conway Maneuver.

### Conway's Law in Practice

For example, having a separate database administrator (DBA) from teams will create software design with one big database. If we want teams to own their portion of the database, we must embed this competency in the team. Once the database ownership belongs to the team, they separate their part of the big database into its own entity they can maintain. That's how Conway's law works in practice.

**Organization design requires technical expertise:** Anyone who makes decisions about organizational structure should at least understand the basics of [software architecture design](/how-to-approach-software-architecture-design).

**Everyone does not need to communicate**: If we want to reduce the coupling between services, we need to make these teams difficult to communicate with each other. When communication is too easy and people (unnecessarily) over-communicate, it reflects on the system design. Although communication is often promoted as a good practice, we need to be mindful if we want this to reflect on our systems. Sometimes keeping communication at a minimum is better if we want the software systems highly separated.

### Team-first Thinking

Defining a team API (similar to service APIs) is a good strategy for designing the team's external communication.

The team API includes the following:

- Code
- Documentation
- Versioning
- Principles & Practices
- Work Information (Roadmap)
- Communication

Everybody who needs to talk to the team should be aware of that and can use that API. Once the API is defined, the team can constrain the stakeholders to use these frameworks when communicating.

### Static Team Topologies

There are two team anti-patterns:

1. Ad-hoc team design: Designing a team to solve a problem at a certain point and, after solving the problem, leaving a few people behind to take care of the maintenance.
2. Shuffling team members: "Temporary Task Forces" is actually an anti-pattern. When we mix the teams, it becomes challenging to maintain the systems because an engineer can behave differently in Team A than in B.

Instead of falling into these anti-patterns, we should consider the team's maturity on the technical and cultural front, internal and inter-team dependencies, organization size, and creating or breaking down silos.

We must adopt and use team topology (team structure) based on our context and consider the long-term instead of solving a problem for the moment.

### The Four Fundamental Team Topologies

Each topology has different demands on the technical and cultural front. Specific topologies (e.g., end-to-end independent teams) require maturity in tech and mature culture to work. They demand consistent monitoring of dependencies to determine if a new dependence occurs. Therefore, we must understand our talent for each topology and team people up according to their knowledge, culture, and growth plans.

The book defines four fundamental team topologies that can be used in an organization.

#### Stream-Aligned Teams

Stream-aligned teams are working on a single stream of work. They are empowered to work end-to-end with their capabilities and don't need to hand their work to another team. They aim to deliver customer value quickly and iteratively and learn and adapt according to their learnings. The other teams help stream-aligned teams to offload some work (e.g., platform and enabling teams we mention below), but most teams should be stream-aligned in an organization.

That's why this team type has to have all capabilities within it. [Amazon's two-pizza teams](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/two-pizza-teams.html) are an excellent example of the size of the team.

Stream-aligned teams should

- Deliver steadily
- Course correct based on feedback they receive from customers
- Use an experimental approach to learn and adapt
- Does not hand work off to others
- Must have time and space to work on tech debt that accumulates from fast delivery and changing requirements
- Have good collaboration between other stream-aligned teams (not to hand off part of work but to deliver steadily)
- Team members must have autonomy, mastery, and purpose—they must be engaged in their work.

#### Enabling Teams

Enabling teams aim to take some pressure off of stream-aligned teams. They focus on filling knowledge gaps. As stream-aligned teams concentrate on delivery, they tend to have little-to-no time for research, reading, learning, and practicing new skills. Enabling teams join stream-aligned teams to fill these gaps. They do not execute on these gaps but rather guide the team and share knowledge on specific topics. As enabling team consists of experts in certain topics, they focus on a problem the stream-aligned team has no time to research. The enabling team temporarily joins the team and shares their knowledge via pairing and workshops and leaves. Enabling teams act like a "Technical Consulting Team." Their pure focus is on helping the stream-aligned team to deliver faster with fewer problems.

#### Complicated-Subsystem Teams

Complicated subsystem teams are formed to reduce the burden and load from stream-aligned teams. These teams focus on a specific and complicated subsystem used by stream-aligned systems and heavily require specialist knowledge. Complicated-subsystem team members have to be experts on their topics. For example, a real-time trade reconciliation algorithm or a face-recognition engine are complicated systems that stream-aligned teams don't need to learn end-to-end.

In organizations, there should be only a few teams like that, not more. These teams should collaborate closely with stream-aligned teams in the beginning and reduce interaction later on. Also, this team should correctly prioritize and deliver high-quality work according to the stream-aligned team's needs.

#### Platform Teams

Platform teams empower stream-aligned teams to deliver work with substantial autonomy. They extract a complicated part of the domain and convert it into a simple self-service platform where stream-aligned teams can consume without understanding every single detail of the sub-domain. Payment platforms like Stripe and Adyen are good examples; they hide the complexity of payments by providing a platform to their customers. Customers don't need to know the payments, billing, and tax details.

Ease of use is fundamental to any platform. That's why platform teams must treat their services as real products and make them reliable, usable, and fit for the purpose. Platforms should be developed the same regardless of serving external or internal users.

Product teams are expected to work and deliver a small number of services with high quality. Platform teams should strongly collaborate with stream-aligned teams and understand their needs. They should also work with small iterations, experimentation, and feedback. They should have a strong focus on usability and reliability. They should regularly assess if the services fit the purpose or not.

The platform team should understand the adaption of the platform will be slow.

The platform always needs to serve its consuming applications and services' needs, not the other way around. A good platform should offer consumers practical and straightforward APIs, templates, standards, and best practices. The platform should be as thin as possible and not dominate the discourse. It aims to reduce the cognitive load of consumer teams and simplify other developers' lives. It has to be consistent and must have well-chosen constraints and a good onboarding experience.

Organizations should treat the platform as a live production system with downtime planned/scheduled and use product and service management techniques.

### Team-First Boundaries

How we shape our teams is important when talking about monolithic applications. There are multiple hidden monoliths that define the organizational structure ([I wrote about hidden monoliths here](/hidden-monoliths-affect-the-software-design)). These monoliths are not only software but also physical offices, deployment pipelines, tech standardization, build and release strategies, and software development strategies such as monolithic databases or applications.

### Team Interaction Modes

After defining the topology of the team, we cannot expect that it will stay as it is. Just saying a platform team doesn't make the team a platform team and remain as it is forever. Team interactions and working styles change along with business needs, market, technology, and personnel needs. The Team Topologies framework defines three team interaction modes between two teams to collaborate effectively and deliver results. These three are Collaboration, X-as-a-service, and Facilitation. To achieve the best results, we define (and redefine) these interaction modes between teams during their lifecycle. Clearly defining these interactions helps teams focus, deliver effectively, determine service boundaries well and stay sustainable.

#### Collaboration Team Interaction Mode

This interaction mode is suited for rapid discovery and innovation. Two teams can collaborate in two ways: each team works on its expertise area and works with the other team on a small set of things, or we merge two teams. Both styles demand good collaboration skills, alignment, and the ability to work with other teams.

Two teams must take responsibility for the work _together_ and build trust. Because close collaboration blurs the responsibility lines, teams must work well together in a trust-based environment.

There will definitely be communication overhead that will cost the organization some efficiency. Therefore, instead of measuring efficiency, the organization should focus on what it gains from rapid discovery and innovation.

There is one restriction for this collaboration mode: one team should have only one other team to collaborate with, not more.

#### X-As-A-Service Team Interaction Mode

Once the discovery is completed by collaboration interaction, it makes sense for one team to own low-level details and provide APIs, components, a platform, or tools to other teams. The goal of separating is to reduce the cognitive load on delivery teams and make the ownership clear.

For this interaction mode to work, boundaries should be well-defined. The X-as-a-service team should have service management capabilities (product management, versioning, etc.) and work on user and developer experience to improve.

The organizational goal in creating an X-as-a-service mode is to reduce interactions between two teams. The delivery team should be able to move quickly by using the service without interacting with the service team. The service team must keep the service viable and not just build features because other teams' asked so but plan features deliberately for further uses and generalization.

#### Facilitating Team Interaction Mode

In facilitating team interaction mode, facilitating team does not build and run the software. The facilitating team coaches or guides stream-aligned teams on a topic they struggle with. Facilitating teams identifies impediments between teams and throughout the organization. As this team often guides others, team members are usually experts and work toward increasing other teams' effectiveness and discovering and removing common problems.

### Expected Team Behaviors for Each Team Interaction Mode

The interaction modes define the expected team behaviors. For example, the collaboration mode demands mutual respect and high interaction while knowing some activities will take longer due to communication overhead. In X-as-a-service mode, the team behavior should shape around providing the best user experience (UX) and/or developer experience (DX), so focusing on experience becomes essential. In facilitating mode, the teams should be open to help and be helped. The team getting help should be open to hearing suggestions and accept the help because the facilitator team has probably seen similar issues before and know better solutions.

To reduce uncertainty and enhance flow, we can explicitly use team interaction modes. For example, we can use the collaboration mode between two teams to discover possible X-as-a-service integrations.

We can also temporarily change the team interaction mode to help a team grow and enhance empathy. When we do this, we have to do it deliberately and with full consent from people. Otherwise, the team who gets help can reject and ignore the other team's suggestions.

We can also use team interaction modes to determine the problems between teams and systems.

### Using Team Topologies To Design the Organization To Design The Systems

Knowing team interaction modes and different team types allows us to design the organization and systems together. Learning about team interaction modes helps us use [Inverse Conway Maneuver](https://www.thoughtworks.com/en-de/radar/techniques/inverse-conway-maneuver) and shape teams as we create systems design.

During the initial organization design, there will be friction between teams and systems. We cannot expect software design to emerge just by designing the teams. That's where temporary roles like [software architect](https://mediations.candost.blog/p/19-software-architect-role-and-archicture) can be influential. Architects are expected to be technical and have social, product, strategy, and people management skills to drive these organizational changes.

### Evolve Team Structures with Organizational Sensing

When designing teams and organizations, we also must design the _design rules_. The business and its needs will change. Our teams need to adjust themselves to these changes. So, we need to think about when to use which collaboration mode and when not to have any communication between the teams. If our organization needs innovation, we can start by using collaboration mode. Later, if we decide to establish the invention as a product, we can move to X-as-a-service or two stream-aligned teams taking parts of the product. Defining these design rules are as crucial as designing teams.

Organizations should have senses to understand their performance and use these senses to learn about their environment and problems. Much like any living organism needs senses to respond to changes in a dynamic environment, organizations can use communication lines between teams, organizations, and users, and also between internal and external stakeholders to understand and adapt to changes. Organizations can also use operations teams (like IT Operations and DevOps) to provide feedback to other teams about problems in operations. To better align feedback, organizations need to have operations teams embedded in development teams instead of having maintenance teams which are usually filled with low-cost labor to lower the costs.

> Software is less of a "product for" and more of an "ongoing conversation with" users. To make this ongoing conversation effective and successful, organizations need a "continuity of care" for their software.
