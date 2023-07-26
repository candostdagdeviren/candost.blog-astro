---
title: "Shift Left on Security"
description: "How would you explain the 'Shift Left on Security' to a five-year-old?"
tags:
  - security
date: 2023-01-15
updateDate: 2023-01-25
external: false
---

> How would you explain the "Shift Left on Security" to a five years old kid?

That was a question that we had to answer in a group exercise at SumUp lately. Each group in an 80-people workshop took a few of the 24 capabilities that drive improvements in software delivery performance from the book Accelerate.

We found a simple explanation and I believe that answer can help many people understand how to include security in their software development processes.

Here we go.

Now, we want to make a sandwich. When we take a bite, we don't want to discover that one of the ingredients is rotten. If the ham is rotten, we want to learn about it before. If one of the cherry tomatoes is gone bad, we should know beforehand, not when we take the bite. Overall, what we want is to eat the freshest sandwich ever. How do we do that?
Our sandwich is as fresh as its ingredients; therefore, we always want fresh ingredients. What can we do to get fresh ingredients to avoid last-minute surprises? We can test the ingredients before making a sandwich. Have a look at them, smell them, or even taste them. That's the first step. What else can we do? We can ensure that we buy the freshest products. How do we do that? Maybe in the supermarket, we can pick the products behind the shelf (supermarkets always put new products on the back). Perhaps we can even go to a farmer's market on Saturdays or take it further; we can go to the fields and pick up our product ourselves. Maybe we can also grow our own product. Once we move our focus from now to the whole process backward, we can actually get the freshest product in the beginning. And during the entire process, we still can ensure they didn't go bad by smelling the ingredients we bought or tasting them before making a sandwich.

We want to ensure that what we do is secure from the beginning and throughout the process. And that's what it means to shift left on security. However, I think one concept is not that clear to many people.

## What the hell does shift left mean?

When we think about any work process, it usually goes from left to right, step by step.
![Work Stream](/images/content/essays/shift-left-on-security/Work-Stream.jpg)

When we think of security, it's often thought of near the end together with Quality Assurance. It's usually part of compliance testing and comes as an afterthought, and it quickly becomes a release blocker if any vulnerability is discovered. These vulnerabilities often demand significant time investment to fix because the implementation details or even sometimes software design are not built with that vulnerability in mind.

![Security is often part of quality assurance testing](/images/content/essays/shift-left-on-security/Shift-Left-on-Security-1.jpg)

If we shift the security review or mindset to the left, we can discover the vulnerabilities earlier, and they often won't require substantial time investments because the software is still in the implementation phase. Yet, if we discover flaws in software design, we'll need to go back and redesign the system.

![Moving security to the left in the process.](/images/content/essays/shift-left-on-security/Shift-Left-on-Security-2.jpg)

That's why shifting security to the left help us build secure systems right from the design.

![Shifting Security to the most left position in the process.](/images/content/essays/shift-left-on-security/Shift-Left-on-Security-3.jpg)

When InfoSec experts are involved in software design, we can build safer systems from end to end. Involving security experts only in the beginning can also be a mistake because the team can fall into traps or make mistakes without recognizing their implementation or testing options downstream of the process. That's why InfoSec experts should be involved in every stage.

![Involving InfoSec experts in every stage.](/images/content/essays/shift-left-on-security/Shift-Left-on-Security-4.jpg)

However, it's not feasible to involve security experts in every single project as that will require a lot of effort both in communication and decision-making. Instead, we can leverage [the Enabling Team Topology from Team Topologies](/books/team-topologies-book-review-summary-and-notes/#enabling-teams). InfoSec folks can join the team in the early stages to guide and improve their knowledge of information security. This way, both the team developing systems learn more about designing and developing secure applications, and InfoSec folks succeed at elevating the knowledge and systems in the company. As a result, the organization benefits from having fewer vulnerabilities.
