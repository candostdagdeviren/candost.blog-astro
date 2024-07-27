---
title: "ADRs and RFCs: Their Differences and Templates"
description: Differences between ADRs and RFCs in software development. When and how to use each with practical guidance and templates for better decision-making.
tags:
  - architecture
date: 2024-01-22
updateDate: 2024-07-27T09:30:00.000Z
external: false
keywords:
  - adr
  - rfc
---

When I wrote about [Request for Comments (RFC)](/how-to-stop-endless-discussions/) documents a few years back, I hadn't tried Architecture Decision Records (ADRs) yet. Although both concepts have existed for years, their popularity has increased in recent years. I finally had a chance to try working with ADRs. When I did, I realized that many people struggle to decide which one to use and when. Although there is [some guidance](https://adr.github.io) on the Internet, I don't see any consensus on how to approach them. I want to share how I separate both and the small nuances that make the two very different.

Let's look at their names first, which I observed people forgetting and going to conceptual or wishful thinking. When I read "architecture decision records," it also clearly says that it's a decision record, so there has to be a decision to record it. When I read "request for comments," it clearly states that the main goal is collecting feedback. With these in mind, I see the natural sequencing of the RFC-first approach in significant changes. The team can start anything by writing an RFC. Then, an accepted RFC can result in multiple ADRs that explain implementation strategies and the architecture of the change.

But not every change requires an RFC. Most of the time, you need to move fast, and an RFC might take a long time and can produce a lot of noise, even though it should stop endless discussions. Or, most of the time, a team decides on a solution together that doesn't impact anyone else. Or, a few people get together and find a solution. They don't need to convince the team; instead, they ask if there are any strong [objections](/how-to-handle-and-overcome-objections-to-your-proposal-at-work/). These are the cases for ADR instead of RFC.

I think listing down the differences and asking a few questions will help everyone better decide which one to use, RFC or ADR.

## Differences between RFCs and ADRs

| RFCs | ADRs |
| ---- | ---- |
| For influencing/driving a change that may (but not necessarily) take time to finalize. | For making/recording a decision that can be executed quickly. |
| Driven by the *community* culture. | Driven by the *team* culture. |
| Help to get people on board for a change. | Help make onboarding easier by giving context. |
| Aim to *validate* or *challenge* the idea. | Aim to *remind* the idea. |
| Help uncover hidden knowledge in other parts of the organization (by getting feedback from people) and make an unknown unknown known. | Help make better future decisions by making implicit decisions explicit. |
| Aim to get feedback similar to incremental product delivery: get feedback early and find the best possible way. | Aim to keep discussions short and on point. |
| It can be small, but the impact should be significant enough *in the context*. | Are small, and the impact doesn't need to be significant. |
| The more people contribute to RFCs and give feedback, the better the result will be. | Only the people who are needed are involved. |
| Should be part of general documentation. | Should stay close to the codebase. |
| Consensus-based decision-making is commonly used but can be consent-based as well. | 100% consent-based decision making. |
| Longer feedback periods | Short feedback period to gather strong objections |
| Mostly asynchronous process | The process can be synchronous (by pairing) or asynchronous |
| Has one of the statuses: Draft, Collecting Feedback, Accepted, Rejected, Abandoned | Has one of the statuses: Draft, In Discussion, Decided, Implemented, Abandoned, Superseded |

## When do we use ADRs? When do we use RFCs?

It's better to start with an end in mind. That demands asking the question, "What's our goal?"

Do you want to introduce a change? Yes.

- Does the change affect others and require buy-in? If yes, **write an RFC** (you have to collect feedback).
- Is the change itself small, but the impact is significant? If yes, **write an RFC** (you still *have to* get feedback).
- If no, **write an ADR.**

You collected feedback on an RFC and decided to move forward. What do you do? **Write ADRs**—as few as possible, as many as you need.
Have you decided to introduce a change with everyone together (maybe in a meeting) and don't need to onboard anyone else? **Write an ADR.**
Do you need to record a past decision that you still remember the details? **Write an ADR.**

That's it. Focus on the end result. There is no need to overthink it. Start now and evolve the processes in time. Done is better than perfect.

---

## Templates

We also need to reduce the difficulty of writing a document and clarify expectations for everyone. Both ADR and RFC processes should be as lightweight as possible. That's where templates come handy. Templates nudge people's thinking and encourage them to structure their thinking.

Feel free to use and adapt the templates below.

## ADR Template

### ADR-XXX: Title

**Status:** Draft, In Discussion, Decided, Implemented, Abandoned, Superseded
**Authors:**
**Decision Date:**

#### Context / Problem

// Define the problem and explain the context driving the decision. What was the need? Link your text with relevant materials. Don't write a novel; keep it as short as possible but as long as necessary.

#### Decision & Rationale

// Explain your decision in one sentence. Then, explain your rationale in bullet points—focus on why you made this decision.

#### (Expected or Known) Consequences

 // Explicitly list down the consequences. If you can, also think and write about the consequences of consequences ([second-order thinking](/chestertons-fence/)).

#### Considered Options (and why they haven't been chosen?)

// List down all the other options you considered with their pros/and cons. Explain in one sentence why didn't you choose that option.

#### Appendix / References

// Add additional materials that can give more context or are relevant to the decision.

#### Update Log: *(not needed if the ADRs are committed to the repository)*

// After the ADR moves out of Draft status, log changes here. A good analogy for this log is having them as meaningful commit messages.

Example Log:

- 2024-01-01: Moved the ADR to In Discussion
- 2024-01-02: Added an extra considered option: XYZ
- 2024-01-03: Abandoned the ADR. The problem is invalid; no solution is needed.

## RFC Template

### RFC-XXX: Title

**Status:** Draft, Collecting Feedback, Accepted, Rejected, Abandoned
**Authors:**
**Feedback Deadline:**
**Last Update Date:**

#### Need (Context / Problem)

// Why do we need to have this change? What was the main reason why you came up with this proposal? The explanation should be as detailed as necessary to present the need. Use examples if possible.

#### Approach

// How are you planning to satisfy the need defined above? The explanation should be as detailed as necessary to fulfill the need.

#### Pros & Cons

// What are the benefits of the proposed approach? Focus on the factual benefits rather than personal points of view.

#### Alternatives (and why aren't they the chosen one)

// Write down [at least two alternatives](https://sive.rs/options) together with their pros and cons.

#### Appendix / References

// Add additional materials that can give more context or are relevant to the decision.

#### Update Log:

// After the ADR moves out of Draft status, log changes here. A good analogy for this log is having them as meaningful commit messages.

Example Log:

- 2024-01-01: Moved to collecting feedback
- 2024-01-10: Added a missed disadvantage for the proposed approach
- 2024-01-21: RFC is accepted with minor changes
