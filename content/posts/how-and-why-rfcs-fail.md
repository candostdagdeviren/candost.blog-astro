---
title: "How and Why RFCs Fail"
description: "When we tried to introduce the Request for Comments (RFC) process to an organization, we failed. Here is what I've learned from my mistakes."
tags:
  - organizational-processes
date: 2023-08-05
updateDate: 2023-08-05
external: false
---

Creating knowledge silos and building software in a team without involving others is unavoidable in growing organizations. That's why organizations create RFC processes to break down silos, collect feedback early and prevent impediments that can come out later in development, which usually are costly. Later these organizations aim to create governance around the RFC process and give guidance to the people through templates and a refined RFC process.

Even though I love the RFC process and have even introduced it to an organization before, I see a lot of traps that organizations (and people) fall into. I want to explain what I have learned and observed in other organizations.

## No Business Need, No RFC

If we ask a group of four software engineers what changes are needed in a system, we will get at least twenty ideas. We introduced RFCs as one way to allow engineers to propose an idea to the business. It was a complete failure. Although we introduced RFCs as a way to promote ideas and create a feedback culture, engineers who tried persuading others felt lost on how to gain support for an idea. Ideas popped up, but they couldn't gain support because there was not a strong business need.

If there is no strong business need for an idea, there shouldn't be an RFC. When I say business, I count both product and technical problems and features. When an RFC is written, there has to be direct support from all directions in the business to solve a certain problem. I say all directions because the need has to be prioritized.

## No Prioritization, No RFC

All organizations have problems that everyone knows but nobody has time to fix it. The time never comes to tackle those problems. Every product has other problems that need to be solved, features that need to be implemented, and changes that have to be made. If someone decides to solve that long-lasting problem without prioritization and writes an RFC to collect feedback, the solution is doomed to fail again.

For RFC to serve well, the solution has to be prioritized correctly. If a team cannot get to solve a problem due to other work packages, developing a solution by writing an RFC won't change the situation. If the team cannot tackle the problem immediately after the RFC is accepted, they will fail. The systems evolve, and decisions made a month or two months ago has to be revised, refined, and adapted to the new changes. The RFC will likely lose its validity by then. Implementation of the RFC should start right after it's closed for feedback. And that requires clear prioritization of the topic.

## Don't Use RFCs as A Decision-Making Mechanism

Similar to the business need we talked about above, the business decision has to be made before writing an RFC. RFC focuses on how, not what—deciding on what has to be done earlier.

An RFC can't drive a business decision; however, it can bring out risks that were not considered before. Thus, it can urge people to reconsider their decision. But that shouldn't be the goal of an RFC; it's only a good side effect.

## Don't Even Try to Form A Consensus

As the business decision has already been made, the RFC authors can decide which piece of feedback they will accept and which ones they will reject. If a team writes an RFC, they don't have to agree or accept every change request, but they have to acknowledge every comment. They have the right to veto by giving a reason. And the reason can be simple: "We're aware of its drawbacks, we acknowledge it, but we're willing to take this risk. We'll continue with the existing design."

There is no need to form a consensus for every topic. The RFC system works with consent-based decision-making by default, and teams should seek consensus only and only when they need it.

## Choose Your Audience Correctly

Not every RFC has to be shared with the whole company. Push RFCs to related people but be open to random people commenting on them.

## Give Enough time (Please, Don't Rush)

If everything is urgent, nothing is urgent. I see people share an RFC to collect feedback and tell the audience that they will close the RFC for comments in two days. If everything is urgent, how can people read an RFC while other urgent tasks are waiting for them?

Of course, it depends on the RFC. If an RFC is circulating in one team, it's okay to have two days because there are only a handful of people who needs to review it. The problem occurs when an RFC impacts more than one team. As every team's priorities are different, people cannot jump into reviewing an RFC when it's shared. Authors have to give enough time for others to review. How much is enough will always depend on the topic and the RFC's impact.

## Don't Publish and Forget; Follow Up

If you publish an RFC and announce it only once, you practically fail.

If there is one thing I learned in organizational leadership, it's this: if you want something, you have to repeat it. If you want to collect feedback for an RFC, you have to remind people constantly that you're looking for feedback.

Give people signs regularly on when you'll close it for feedback. Be proactive. To be honest, be annoying if needed. When you close an RFC for feedback, you should feel comfortable that you got enough feedback. Nobody should be able to complain about the solution when the time comes for implementation. And if they still complain, you should be able to say, "Well, we collected feedback and announced it everywhere, pinged many times. Sorry, we're following the decided strategy."

## Don't Build an Extensive Template

Organizations should influence people to write RFCs, and the guides to writing them should be simple, clear, and concise. If an RFC template has ten sections that have to be filled, it ceases to help.

An RFC template should be flexible. It's there to guide people's thoughts. A template should not only make writing easier but also understanding easier.

I still recommend NABC Model (Need, Approach, Benefits, Competitors) that Stanford introduced. It's short and guides people in a direction where it's easy to understand.

## Build The Right Culture First

The whole RFC process requires a blameless and trustful environment. If the organization operates with bad politics and secrecy, forget about RFCs. If an engineer doesn't trust others and doesn't believe people have good intentions, why would they seek feedback? Even if they did, would they accept feedback? I don't think so.

Another cultural challenge for RFCs is the stage of the organization. If the product is pivoting or an engineering paradigm shift is going on, RFCs cannot survive. Especially while trying to find product-market fit and runway budget is limited, RFCs are not the right strategy.

Engineering paradigm shifts depend on the organization's maturity. If the organization is mature enough, RFCs are a great way to shift the engineering paradigm. However, it won't work in an immature organization where there are long discussions and fights everywhere.

Get your culture right, and people will naturally bring the RFC process by themselves. Use RFCs to create a feedback culture and enhance your engineering strength and stamina. It's one of the best ways to break silos and build a healthy engineering organization that communicates and collaborates.
