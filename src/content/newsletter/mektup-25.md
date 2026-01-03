---
title: "Mektup #25: You Need A Definition of Done in Your Team"
tags:
  - mektup
newsletterName: "Mektup"
issueNumber: "25"
date: 2022-02-22
updateDate: 2022-02-22
external: false
---

Hey friend,

In the last Mektup, I mentioned the Definition of Done when discussing reliability. Now, I want to dig deeper into it and explore why you and your team need one.

If you hear someone says, *"The work is done,"* but they need to do some minor things or add tests to ensure everything works, the work is actually not *"done"*! These situations appear more when there is no agreement about what Done means. Without the explicit Definition of Done (DoD), I always see that people use various definitions they *imagined*. Especially when tasks depend on each other, a different understanding of Done can cause misaligned expectations, conflicts, and double work.

Instead of **[implicit misunderstandings](/explicit-disagreement-is-better-than-implicit-misunderstanding/)**, we need to make our processes as explicit and transparent as possible and create a common language for the phrases we use. Working agreements and using the same language enable us to focus on crucial and complex issues and free our brainpower.

## What is the Definition of Done?

The Definition of Done is a written agreement between team members and stakeholders that people can point to when the other side is breaking it. We can think of it as a contract. Wherever we deliver work, we can ensure what is included and what's not.

DoD is not only for better communication but also for quality and best practices. Ensuring we deliver high-quality work is often a debate between engineer and product teams. While product teams (e.g., product managers) want to push the feature to market quickly, engineers want to produce high-quality software. Once the quality is part of DoD, it becomes easier to negotiate and agree with product managers/owners.

For example, suppose having unit and integration tests are part of DoD. Whenever our stakeholders push us to release the feature early and communicate that we're done with the feature, the engineering side can quickly raise a flag and say, "Sorry, we're not done yet. As we agreed on DoD, tests are missing, and we have to do that before the release." This way, we prevent a possible tech debt, raise our confidence in our work and achieve consistent product quality.

## What should you include in the Definition of Done?

The beauty of DoD is its uniqueness for the team. Every team has different operational routines. DoD can be generalized to the company at a higher level, but teams always differ according to their projects and stakeholders. For example, creating one DoD that covers both DevOps and product teams won't be easy. Having separate DoD is better for every team.

I won't go into the process of creating a DoD today; that will be the next Mektup. But let me leave one example of the Definition of Done that we used in our backend team to give you an idea of what it can include.

## Example Definition of Done

### Implementation Complete

- Acceptance criteria are met.
- Appropriate alerting and monitoring are configured.
- Appropriate error handling and logging are implemented.

### Quality Assurance

#### Code Review

- Pull request is created, reviewed, and approved by another engineer.
- Pull requests have;
  - A link to the relevant ticket, which is meant to resolve.
  - Have a short description of why that specific approach is taken during the implementation.

#### Testing

- Appropriate testing is implemented (unit, smoke, integration, end-to-end).
- Tests are passed in the continuous integration (CI) before merging the pull request.

### Release

- Deployed to the relevant environment(s).
- The Jira board and relevant tickets are updated.
- Stakeholders are informed.

A Definition of Done is a living agreement, which means whenever we recognize that our operation is changed, the DoD needs an update. Teams, companies, and products evolve and change often, and we have to acknowledge these changes and apply them to our agreements.

In the next Mektup, I will talk about developing a Definition of Done for your team and how you can agree on it with your stakeholders.

Do you already have a definition of done? If yes, how does it work for you?

Looking forward to your answer. Thanks in advance!

​— Candost

### A Quote I'm Pondering

> "Your success in life will be determined largely by your ability to speak, your ability to write, and the quality of your ideas. In that order." — [Patrick Winston](https://www.youtube.com/watch?v=Unzc731iCUY)

### Today I Learned

Grammarly has a desktop app (in addition to its desktop editor) that works almost in every app. 😍
